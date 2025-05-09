import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class MistralService {
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = '629doL2ST7OmILNNRJQ8nYddC4SL0VS8';

  private validTopics = [
    "ganado", "vacas", "vaca","novillo", "ternero", "becerro", "añojal", "hermosillo", "levante", "ceba", "destete", "precebo", "carga animal",  
    "ganado doble propósito", "ganado criollo", "ganado comercial", "ganado puro", "brahman", "gyr", "romosinuano", "costeño con cuernos",  
    "bon", "blanco orejinegro", "sanmartinero", "pajueleo", "semental", "madre de cría", "transferencia de embriones",  
    "ciclo productivo", "índice de conversión", "ganancia diaria de peso", "peso al destete", "pastoreo rotacional", "silvopastoreo", "carga instantánea",  
    "pradera mejorada", "sistema agrosilvopastoril", "forraje hidropónico", "silo de maíz", "ensilaje", "henolaje", "bloques multinutricionales",  
    "urea protegida", "pasto estrella", "brachiaria", "megathyrsus maximus", "terneraje", "peso vivo", "condición corporal", "puntaje de condición corporal",  
    "suplementación estratégica", "ruminación", "eficiencia alimenticia", "bovinos", "terneros", "toros", "producción de leche", "engorde", "sano",
    "carne de res", "razas de ganado", "alimentación de ganado", "sanidad animal", "enfermeria", "hartón del valle", "medico", "medicina", "medicinas",
    "enfermedades del ganado", "crianza de ganado", "veterinaria", "pesaje de ganado", "sanmartinero", "bon", "casanareño", 
    "mercado de carne", "control de peso", "reproducción animal", "inseminación artificial", "brahman", "gyr", "romosinuano", "costeño con cuernos",  
    "lucerna", "velásquez", "normando", "holstein", "pardo suizo", "jersey", "charolais", "simental", "angus", "brangus", "enfermo", "mantener",
    "simbráh", "nelore", "senepol", "santa gertrudis", "chino santandereano", "pasiega", "blonda de aquitania", "cruce cebú europeo", "saludable",
    "bos indicus", "bos taurus", "f1 lechero", "f1 cárnico", "doble propósito", "ganado comercial", "línea materna", "línea paterna",  
    "índice de conversión", "eficiencia alimenticia", "rumia", "peso vivo", "ceba intensiva", "cría extensiva", "destete precoz",  
    "madre de cría", "potrero mejorado", "pradera mixta", "suplementación estratégica", "silvopastoreo", "forraje de corte",  
    "bloques multinutricionales", "ensilaje de maíz", "suplemento proteico", "condición corporal", "pastoreo racional", "razas"

  ];

  constructor() {}

  private isQuestionValid(question: string): boolean {
    return this.validTopics.some(topic => question.toLowerCase().includes(topic));
  }

  async getAIResponse(message: string): Promise<string> {
    if (!this.isQuestionValid(message)) {
      return "❌ Solo respondo preguntas sobre ganado y animales.";
    }
  
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: "mistral-tiny",
          messages: [
            { role: "system", content: "Eres un experto en ganadería colombiana. Responde de forma clara, técnica y precisa, adaptando el formato de la respuesta según la pregunta del usuario. Si la pregunta requiere una serie de pasos, utiliza una lista numerada. En otros casos, responde de manera explicativa y profesional. Evita errores gramaticales y usa los términos adecuados del sector ganadero." },
            { role: "user", content: message }
          ],
          temperature: 0.4,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      let responseText = response.data.choices?.[0]?.message?.content || "No entendí la pregunta.";
  
      responseText = responseText.replace(/(\d+\.)/g, '\n$1');
  
      responseText = responseText.replace(/\bla ganado\b/g, "el ganado");
      responseText = responseText.replace(/\buna novillo\b/g, "un novillo");
  
      responseText = responseText.replace(/\*\*(.*?)\*\*/g, '$1');
  
      return responseText;
    } catch (error) {
      console.error("❌ Error con Mistral AI:", error);
      return "Hubo un error al procesar la solicitud.";
    }
  }
}  