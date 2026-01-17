import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeFoodImage = async (base64Image) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Remove prefix if exists (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.split(',')[1] || base64Image;

        const prompt = `You are an elite Bio-Nutritionist. Analyze this food image for a high-performance athlete.
        Provide the following information in JSON format:
        {
            "foodName": "Scientific or culinary name",
            "calories": estimated_calories_number,
            "protein": grams_number,
            "carbs": grams_number,
            "fat": grams_number,
            "description": "Biological analysis of ingredients (e.g. high in polyphenols, good for recovery)",
            "recommendation": "Bio-Hack Tip: specify 1 specific addition like 'add turmeric for inflammation' or 'consume with healthy fats'",
            "portionSize": "Pequeña | Normal | Grande",
            "confidence": 0-100,
            "genomicSuitability": "High | Medium | Low",
            "bioScore": 0-100
        }
        Be precise and respond in Spanish for the description and recommendation fields. Only return the JSON object.`;



        const image = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, image]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from text (in case Gemini adds markdown blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Could not parse AI response');
    } catch (error) {
        console.error('Error analyzing image with Gemini:', error);
        throw error;
    }
};

export const getWellnessAdvice = async (message, context) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const personas = {
            nutrition: "un Nutricionista Bio-Molecular experto en nutrigenómica",
            exercise: "un Entrenador de Alto Rendimiento experto en fisiología del ejercicio",
            sleep: "un Especialista en Medicina del Sueño yRitmos Circadianos",
            mind: "un Neuropsicólogo experto en optimización cognitiva y biofeedback",
            general: "BioBalance AI, tu asistente integral de bienestar"
        };

        const persona = personas[context.expert] || personas.general;

        const prompt = `Actúa como ${persona}. 
        Tu objetivo es proporcionar consejos empáticos, científicamente fundamentados y procesables.
        
        CONTEXTO DEL USUARIO:
        - Perfil de Riesgo: ${context.riskProfile || 'Estándar'}
        - Ánimo Reciente: ${context.recentMood || 'No registrado'}
        - Calorías Diarias: ${context.calories || 0} kcal
        - Meta de Peso: ${context.weightGoal || 'Mantenimiento'}
        - Función Actual: ${context.expert || 'General'}
        
        PREGUNTA DEL USUARIO: "${message}"
        
        INSTRUCCIONES:
        - Tu respuesta debe ser altamente especializada según tu rol de ${persona}.
        - Si el usuario pregunta por comidas, sé específico en micro-nutrientes.
        - Si pregunta por ejercicio, menciona la conexión mente-músculo o sistemas energéticos.
        - Usa markdown: usa negritas para títulos, puntos para listas.
        - Responde en Español. Mantén un tono elegante, futurista y profesional. Sé breve pero impactante.`;

        const result = await model.generateContent(prompt);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting AI advice:', error);
        throw error;
    }
};

export const getRecipeSuggestions = async (context) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Generate 3 healthy recipes in Spanish based on these user traits:
        - Goal: ${context.weightGoal || 'Balance'}
        - Risk Profile: ${context.riskProfile || 'None'}
        - Calories: ${context.calories || 2000} kcal per day

        Respond ONLY with a JSON array:
        [
            {
                "title": "Title",
                "calories": 400,
                "time": "20 min",
                "ingredients": ["item1", "item2"],
                "steps": ["step1", "step2"],
                "visualPrompt": "A professional food photography of [dish name], soft natural lighting, morning vibe, ultra realistic"
            }
        ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
        console.error('Error getting recipes:', error);
        return [];
    }
};

export const getDailyWisdom = async (context) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Based on this user context:
        - Points: ${context.points}
        - Level: ${context.level}
        - Latest Mood: ${context.lastMood}
        
        Generate a "Daily Bio-Hack" in Spanish. It should be:
        1. A surprising health fact or a very specific tip.
        2. Short (2 sentences).
        3. Scientific but easy to understand.
        4. Motivational.
        
        Respond ONLY with a JSON object: { "title": "Fact/Tip Title", "content": "The actual hack content" }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { title: "Enfoque del Día", content: "Mantente hidratado y prioriza proteínas en tu próxima comida." };
    } catch (error) {
        console.error('Error getting daily wisdom:', error);
        return { title: "Enfoque del Día", content: "Mantente hidratado y prioriza proteínas en tu próxima comida." };
    }
};

export const generateWellnessReport = async (context) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Based on this user's progress in BioBalance:
        - Points: ${context.points}
        - Level: ${context.level}
        - Badges: ${context.badges}
        - Latest Mood: ${context.lastMood}
        
        Generate a "Wellness Success Report" in Spanish. 
        It should be an inspiring analysis of their progress, making them feel like a health champion.
        Use a professional yet high-energy tone.
        
        Respond ONLY with a JSON object: 
        { 
            "title": "Report Title (e.g., Informe de Evolución Biológica)", 
            "summary": "Full summary text with emojis and professional insights",
            "strengths": ["Strength 1", "Strength 2", "Strength 3"],
            "improvements": ["Improvement 1", "Improvement 2"],
            "nextSteps": ["Action 1", "Action 2"],
            "quote": "A powerful motivational quote related to bio-hacking"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : {
            title: "Tu Reporte de Éxito",
            summary: "Sigues avanzando con determinación. Tus puntos demuestran tu compromiso con el Bio-Balance.",
            strengths: ["Consistencia en el entrenamiento", "Registro emocional activo"],
            improvements: ["Optimización de hidratación"],
            nextSteps: ["Aumentar consumo de agua", "Probar meditación"],
            quote: "La disciplina es el puente entre las metas y el logro."
        };
    } catch (error) {
        console.error('Error generating wellness report:', error);
        return {
            title: "Tu Reporte de Éxito",
            summary: "Sigues avanzando con determinación. Tus puntos demuestran tu compromiso con el Bio-Balance.",
            strengths: ["Consistencia en el entrenamiento"],
            improvements: ["Optimización de hidratación"],
            nextSteps: ["Continuar con tu rutina actual"],
            quote: "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
        };
    }
};
