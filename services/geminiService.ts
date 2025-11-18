import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64, getMimeType } from "./imageUtils";
import { AdSettings, ImageAction, UploadedImage } from "../types";

// Initialize the client
// Note: API_KEY is injected via process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the real estate ad text based on original images and settings.
 */
export const generateAdText = async (
  images: UploadedImage[],
  settings: AdSettings
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Prepare image parts
    const imageParts = await Promise.all(
      images.map(async (img) => ({
        inlineData: {
          data: await fileToBase64(img.file),
          mimeType: getMimeType(img.file),
        },
      }))
    );

    const prompt = `
      Actúa como un experto redactor inmobiliario (copywriter).
      
      Tu tarea es escribir un anuncio inmobiliario atractivo basado en las imágenes proporcionadas de una propiedad.
      
      Configuración del anuncio:
      - Público Objetivo: ${settings.audience}
      - Extensión: ${settings.length}
      - Tono: ${settings.tone}
      
      Instrucciones:
      1. Analiza las imágenes para identificar características clave (luz, espacios, materiales, distribución).
      2. Escribe el anuncio en español.
      3. Usa saltos de línea para facilitar la lectura.
      4. No inventes características que no se vean, pero puedes inferir la calidad o el ambiente.
      5. Estructura el texto con un título llamativo y un cuerpo persuasivo.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [...imageParts, { text: prompt }],
      },
    });

    return response.text || "No se pudo generar el texto del anuncio.";
  } catch (error) {
    console.error("Error generating ad text:", error);
    throw new Error("Falló la generación del texto del anuncio.");
  }
};

/**
 * Edits a single image based on the selected action (Stage or Empty).
 */
export const editImage = async (
  image: UploadedImage
): Promise<string | null> => {
  if (image.selectedAction === ImageAction.KEEP) {
    return null; // No processing needed
  }

  try {
    const model = "gemini-2.5-flash-image";
    const base64Data = await fileToBase64(image.file);
    const mimeType = getMimeType(image.file);

    let promptText = "";
    
    if (image.selectedAction === ImageAction.STAGE) {
      promptText = "Transform this room into a clean, modern living space. Add stylish, modern Ikea-style furniture appropriate for the room type (bedroom, living room, etc.). Keep the architectural structure (walls, windows, floors, ceiling) exactly as they are. Ensure the lighting is natural and inviting. Photorealistic real estate photography.";
    } else if (image.selectedAction === ImageAction.EMPTY) {
      promptText = "Remove all furniture, decor, clutter, and objects from this room. Show the empty space with just the bare floor, walls, and windows. Keep the architectural structure, flooring material, and lighting exactly as they are. Photorealistic empty room real estate photography.";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image from response
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    
    return null;

  } catch (error) {
    console.error(`Error processing image ${image.id}:`, error);
    // Return null to indicate failure but don't crash the whole batch
    return null;
  }
};