
export type Language = 'en' | 'pt';

export const translations = {
    en: {
        meta: {
            title: "Own Your Financial Future | RCCG City Church",
            description: "Free Masterclass on Financial Intelligence and Wealth Creation. Hosted by RCCG City Church Luanda.",
        },
        nav: {
            brand_first: "RCCG",
            brand_second: "City Church",
            cta: "Secure Spot"
        },
        hero: {
            tag: "Free Masterclass • Feb 14",
            title_prefix: "Own Your",
            title_highlight: "Financial Future",
            title_suffix: "",
            subtitle: "Free Masterclass on Financial Intelligence and Wealth Creation.",
            date_label: "Date",
            date_val: "February 14, 2026",
            time_label: "Time",
            time_val: "10:00 AM",
            location_label: "Location",
            location_val: "RCCG City Church Auditorium, Luanda"
        },
        countdown: {
            days: "Days",
            hours: "Hours",
            minutes: "Mins",
            seconds: "Secs"
        },
        register: {
            title: "Reserve Your Seat",
            subtitle: "Free Entry • Limited Seats",
            security: "256-bit Secure Encryption. No spam, ever.",
            success_title: "Access Granted",
            success_msg: "Your seat at the Own Your Financial Future Masterclass is confirmed.\nThe details have been sent to your inbox.",
            whatsapp_btn: "Join Event WhatsApp Group",
            whatsapp_url: "https://chat.whatsapp.com/COLAR_LINK_DO_GRUPO_AQUI", // <--- COLA O LINK DO TEU GRUPO AQUI
            back_btn: "Return to Home"
        },
        form: {
            name_label: "Your Name",
            name_placeholder: "e.g. Alexander Hamilton",
            email_label: "Email Address",
            email_placeholder: "access@example.com",
            phone_label: "Phone Number",
            phone_placeholder: "+244 935 348 327",
            consent_pre: "I accept the",
            consent_link: "Privacy Policy",
            consent_post: "and understand available seats are limited.",
            submit_btn: "Secure My Spot",
            processing: "Processing...",
            error: "Something went wrong. Please try again.",
            limit_reached: "Sorry, we have reached the limit of 100 participants."
        },
        curriculum: {
            pill: "The Curriculum",
            title_prefix: "Three Pillars of",
            title_highlight: "Intelligence",
            subtitle: "A carefully curated syllabus designed to dismantle limiting beliefs and reconstruct your financial reality.",
            items: [
                {
                    title: "Winning Financial Mindset",
                    description: "Reprogram your mind to attract abundance and eliminate scarcity patterns.",
                    icon: "fa-brain"
                },
                {
                    title: "5 Pillars of Intelligence",
                    description: "Master the core fundamentals that every successful investor must know.",
                    icon: "fa-columns"
                },
                {
                    title: "Wealth Creation Strategies",
                    description: "Practical methods to multiply your net worth and compound your wealth.",
                    icon: "fa-chart-line"
                },
                {
                    title: "Smart Money Management",
                    description: "Organize your finances and plug the leaks in your monthly budget.",
                    icon: "fa-wallet"
                },
                {
                    title: "Investing for Beginners",
                    description: "Where to start, how to evaluate risks, and common mistakes to avoid.",
                    icon: "fa-seedling"
                },
                {
                    title: "Passive Income Streams",
                    description: "Create automated income sources that work for you while you sleep.",
                    icon: "fa-money-bill-trend-up"
                },
                {
                    title: "Personal Action Plan",
                    description: "A customized framework to implement your learning immediately.",
                    icon: "fa-list-check"
                }
            ]
        },
        host: {
            role: "Hosted By",
            name_first: "RCCG",
            name_last: "City Church",
            quote: "Empowering our community with the knowledge to build sustainable wealth and financial freedom.",
            bio: "Join us at the City Church Auditorium for a transformative session. We believe in total prosperity - spirit, soul, and body.",
            stat_label: "Community",
            stat_val: "Global",
            stat_label2: "Faith",
            stat_val2: "Impact"
        },
        testimonials: {
            title: "Community Voices",
            items: [
                {
                    name: "Sarah Jenkins",
                    role: "Small Business Owner",
                    content: "This training completely shifted how I view my business profits. I went from living month-to-month to building a solid investment portfolio in just 6 months.",
                    image: "https://picsum.photos/id/64/200/200"
                },
                {
                    name: "Mark Thompson",
                    role: "Software Engineer",
                    content: "The passive income strategies shared in this masterclass are pure gold. I've already started my first real estate investment trust thanks to these lessons.",
                    image: "https://picsum.photos/id/91/200/200"
                },
                {
                    name: "Elena Rodriguez",
                    role: "Freelancer",
                    content: "Finally, someone who explains finance without the confusing jargon. I feel empowered and for the first time, in total control of my future.",
                    image: "https://picsum.photos/id/65/200/200"
                }
            ]
        },
        faq: {
            title: "Clarifications",
            items: [
                {
                    question: "Is this masterclass really free?",
                    answer: "Yes, 100%. We believe financial education should be accessible. There is no cost to attend."
                },
                {
                    question: "Do I need previous financial knowledge?",
                    answer: "Not at all. We designed this to take you from the basics to advanced strategies in a clear, step-by-step manner."
                },
                {
                    question: "Will I receive a certificate?",
                    answer: "Yes, all live participants will receive a digital Certificate of Completion to showcase their commitment to financial growth."
                },
                {
                    question: "How long is the training?",
                    answer: "The session lasts approximately 120 minutes, including a dedicated Q&A section at the end."
                },
                {
                    question: "How do I access the event?",
                    answer: "It is a live in-person event at RCCG City Church Auditorium, Luanda. Register to secure your seat."
                },
                {
                    question: "Is there parking available?",
                    answer: "Yes, there is ample parking space available at the church premises."
                }
            ]
        },
        final_cta: {
            tag: "The Final Call",
            title_prefix: "Redefine Your",
            title_highlight: "Destiny",
            subtitle: "Excellence is not an act, but a habit. The doors are open. The rest is your move.",
            btn: "Claim Free Spot"
        },
        footer: {
            desc: "Empowering you to own your financial future.",
            col_legal: "Legal",
            link_confidentiality: "Confidentiality",
            link_privacy: "Privacy Policy",
            link_terms: "Terms of Use",
            col_connect: "Connect",
            rights: "© 2026 RCCG City Church. All Rights Reserved.",
            tagline: "Excellence in Ministry"
        },
        assistant: {
            welcome: "Welcome. How can I assist you with the event details?",
            title: "Event Assistant",
            placeholder: "Ask about the location...",
            error_connect: "I am currently unable to connect. Please try again briefly.",
            error_generic: "I apologize, a connection error occurred."
        }
    },
    pt: {
        meta: {
            title: "Dono do Seu Futuro Financeiro | RCCG City Church",
            description: "Masterclass Gratuita sobre Inteligência Financeira e Criação de Riqueza. Organizado pela RCCG City Church Luanda.",
        },
        nav: {
            brand_first: "RCCG",
            brand_second: "City Church",
            cta: "Garantir Vaga"
        },
        hero: {
            tag: "Masterclass Gratuita • 14 Fev",
            title_prefix: "Dono do Seu",
            title_highlight: "Futuro Financeiro",
            title_suffix: "",
            subtitle: "Masterclass Gratuita sobre Inteligência Financeira e Criação de Riqueza.",
            date_label: "Data",
            date_val: "14 de Fevereiro, 2026",
            time_label: "Horário",
            time_val: "10:00",
            location_label: "Localização",
            location_val: "RCCG City Church Auditorium, Luanda"
        },
        countdown: {
            days: "Dias",
            hours: "Horas",
            minutes: "Mins",
            seconds: "Segs"
        },
        register: {
            title: "Reserve Seu Lugar",
            subtitle: "Entrada Gratuita • Vagas Limitadas",
            security: "Seus dados estão seguros.",
            success_title: "Acesso Confirmado",
            success_msg: "Seu lugar na Masterclass Dono do Seu Futuro Financeiro está confirmado.\nOs detalhes foram enviados para o seu email.",
            whatsapp_btn: "Entrar no Grupo do WhatsApp",
            whatsapp_url: "https://chat.whatsapp.com/COLAR_LINK_DO_GRUPO_AQUI", // <--- COLA O LINK DO TEU GRUPO AQUI
            back_btn: "Voltar ao Início"
        },
        form: {
            name_label: "Seu Nome",
            name_placeholder: "ex. Agostinho Neto",
            email_label: "Email",
            email_placeholder: "seu@email.com",
            phone_label: "Número de Telefone",
            phone_placeholder: "+244 935 348 327",
            consent_pre: "Eu aceito a",
            consent_link: "Política de Privacidade",
            consent_post: "e entendo que as vagas são limitadas.",
            submit_btn: "Garantir Meu Lugar Grátis",
            processing: "Processando...",
            error: "Algo deu errado. Por favor, tente novamente.",
            limit_reached: "Desculpe, atingimos o limite de 100 participantes."
        },
        curriculum: {
            pill: "O Currículo",
            title_prefix: "Três Pilares da",
            title_highlight: "Inteligência",
            subtitle: "Um roteiro cuidadosamente elaborado para desmontar crenças limitantes e reconstruir sua realidade financeira.",
            items: [
                {
                    title: "Mentalidade Financeira Vencedora",
                    description: "Reprograme sua mente para atrair abundância e eliminar padrões de escassez.",
                    icon: "fa-brain"
                },
                {
                    title: "5 Pilares da Inteligência",
                    description: "Domine os fundamentos essenciais que todo investidor de sucesso deve saber.",
                    icon: "fa-columns"
                },
                {
                    title: "Estratégias de Criação de Riqueza",
                    description: "Métodos práticos para multiplicar seu patrimônio líquido e compor sua riqueza.",
                    icon: "fa-chart-line"
                },
                {
                    title: "Gestão Inteligente do Dinheiro",
                    description: "Organize suas finanças e tape os vazamentos em seu orçamento mensal.",
                    icon: "fa-wallet"
                },
                {
                    title: "Investindo para Iniciantes",
                    description: "Por onde começar, como avaliar riscos e erros comuns a evitar.",
                    icon: "fa-seedling"
                },
                {
                    title: "Fluxos de Renda Passiva",
                    description: "Crie fontes de renda automatizadas que trabalham para você enquanto dorme.",
                    icon: "fa-money-bill-trend-up"
                },
                {
                    title: "Plano de Ação Pessoal",
                    description: "Uma estrutura personalizada para implementar seu aprendizado imediatamente.",
                    icon: "fa-list-check"
                }
            ]
        },
        host: {
            role: "Organizado Por",
            name_first: "RCCG",
            name_last: "City Church",
            quote: "Capacitando nossa comunidade com o conhecimento para construir riqueza sustentável e liberdade financeira.",
            bio: "Junte-se a nós no Auditório da City Church para uma sessão transformadora. Acreditamos na prosperidade total - espírito, alma e corpo.",
            stat_label: "Comunidade",
            stat_val: "Global",
            stat_label2: "Fé",
            stat_val2: "Impacto"
        },
        testimonials: {
            title: "Vozes da Comunidade",
            items: [
                {
                    name: "Sarah Jenkins",
                    role: "Pequena Empresária",
                    content: "Este treinamento mudou completamente a forma como vejo os lucros do meu negócio. Passei de viver mês a mês para construir um portfólio de investimentos sólido em apenas 6 meses.",
                    image: "https://picsum.photos/id/64/200/200"
                },
                {
                    name: "Mark Thompson",
                    role: "Engenheiro de Software",
                    content: "As estratégias de renda passiva compartilhadas nesta masterclass são puro ouro. Já comecei meu primeiro fundo de investimento imobiliário graças a essas lições.",
                    image: "https://picsum.photos/id/91/200/200"
                },
                {
                    name: "Elena Rodriguez",
                    role: "Freelancer",
                    content: "Finalmente, alguém que explica finanças sem o jargão confuso. Sinto-me empoderada e, pela primeira vez, no total controle do meu futuro.",
                    image: "https://picsum.photos/id/65/200/200"
                }
            ]
        },
        faq: {
            title: "Esclarecimentos",
            items: [
                {
                    question: "Esta masterclass é realmente gratuita?",
                    answer: "Sim, 100%. Acreditamos que a educação financeira deve ser acessível. Não há custo para participar."
                },
                {
                    question: "Preciso de conhecimento financeiro prévio?",
                    answer: "De jeito nenhum. Projetamos isso para levá-lo do básico às estratégias avançadas de maneira clara e passo a passo."
                },
                {
                    question: "Receberei um certificado?",
                    answer: "Sim, todos os participantes receberão um Certificado de Conclusão digital."
                },
                {
                    question: "Quanto tempo dura o treinamento?",
                    answer: "A sessão dura aproximadamente 120 minutos, incluindo uma seção dedicada de perguntas e respostas no final."
                },
                {
                    question: "Como acesso o evento?",
                    answer: "É um evento presencial no Auditório da RCCG City Church, Luanda. Registre-se para garantir seu lugar."
                },
                {
                    question: "Há estacionamento disponível?",
                    answer: "Sim, há amplo espaço de estacionamento disponível nas instalações da igreja."
                }
            ]
        },
        final_cta: {
            tag: "A Chamada Final",
            title_prefix: "Redefina Seu",
            title_highlight: "Destino",
            subtitle: "Excelência não é um ato, mas um hábito. As portas estão abertas. O resto é com você.",
            btn: "Garantir Vaga Grátis"
        },
        footer: {
            desc: "Capacitando você a ser dono do seu futuro financeiro.",
            col_legal: "Legal",
            link_confidentiality: "Confidencialidade",
            link_privacy: "Política de Privacidade",
            link_terms: "Termos de Uso",
            col_connect: "Conectar",
            rights: "© 2026 RCCG City Church. Todos os Direitos Reservados.",
            tagline: "Excelência no Ministério"
        },
        assistant: {
            welcome: "Bem-vindo. Como posso ajudá-lo com os detalhes do evento?",
            title: "Assistente do Evento",
            placeholder: "Pergunte sobre a localização...",
            error_connect: "No momento não consigo conectar. Por favor, tente novamente em breve.",
            error_generic: "Peço desculpas, ocorreu um erro de conexão."
        }
    }
};
