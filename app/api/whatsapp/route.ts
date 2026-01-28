import { NextRequest, NextResponse } from "next/server";

// Configuração da API do WhatsApp
// Você pode usar: Twilio, Meta WhatsApp Business API, ou outros provedores
// Por padrão, usaremos a API wa.me para abrir uma mensagem pré-preenchida
// Para envio automático, configure as variáveis de ambiente abaixo

interface WhatsAppMessageRequest {
    phone: string;
    name: string;
    message?: string;
}

// Formatar número de telefone para formato internacional
function formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, "");

    // Se começar com 00, remove
    if (cleaned.startsWith("00")) {
        cleaned = cleaned.substring(2);
    }

    // Se não tiver código de país (Angola = 244), adiciona
    if (cleaned.length <= 9) {
        cleaned = "244" + cleaned;
    }

    return cleaned;
}

// Mensagem de confirmação padrão
function getConfirmationMessage(name: string): string {
    return `🎉 *Parabéns ${name}!*

A sua inscrição no evento *"Own Your Financial Future - Masterclass"* foi *APROVADA*! ✅

📅 *Data:* 8 de Fevereiro de 2026
📍 *Local:* Luanda, Angola

Estamos muito felizes em tê-lo(a) connosco nesta jornada de transformação financeira.

Em breve, enviaremos mais detalhes sobre o evento.

_Vitaleevo - Transformando Vidas_

---

🎉 *Congratulations ${name}!*

Your registration for *"Own Your Financial Future - Masterclass"* has been *APPROVED*! ✅

📅 *Date:* February 8, 2026
📍 *Location:* Luanda, Angola

We are very happy to have you with us on this financial transformation journey.

Soon, we will send more details about the event.

_Vitaleevo - Transforming Lives_`;
}

export async function POST(request: NextRequest) {
    try {
        const body: WhatsAppMessageRequest = await request.json();
        const { phone, name, message } = body;

        if (!phone) {
            return NextResponse.json(
                { error: "Número de telefone é obrigatório" },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phone);
        const confirmationMessage = message || getConfirmationMessage(name);

        // Verificar se temos configuração para envio automático via API
        const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
        const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;

        if (whatsappApiToken && whatsappPhoneId) {
            // Envio automático via Meta WhatsApp Business API
            try {
                const response = await fetch(
                    `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${whatsappApiToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            messaging_product: "whatsapp",
                            to: formattedPhone,
                            type: "text",
                            text: {
                                body: confirmationMessage,
                            },
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error("WhatsApp API Error:", result);
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Falha ao enviar mensagem via API",
                            details: result,
                            fallbackUrl: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(confirmationMessage)}`
                        },
                        { status: 500 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    method: "api",
                    messageId: result.messages?.[0]?.id,
                    phone: formattedPhone,
                });
            } catch (apiError) {
                console.error("WhatsApp API call failed:", apiError);
                // Fallback para URL manual
            }
        }

        // Se não tiver API configurada, retorna URL para envio manual
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(confirmationMessage)}`;

        return NextResponse.json({
            success: true,
            method: "manual",
            url: whatsappUrl,
            phone: formattedPhone,
            message: "API não configurada. Use o link para enviar manualmente.",
        });

    } catch (error) {
        console.error("Error in WhatsApp API route:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
