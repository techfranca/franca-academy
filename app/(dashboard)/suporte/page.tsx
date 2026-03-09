import { LifeBuoy, MessageCircle, Bug, Lightbulb, HelpCircle, ExternalLink } from 'lucide-react'

const supportReasons = [
  {
    icon: HelpCircle,
    title: 'Dúvidas sobre o sistema',
    description: 'Está com dificuldade para acessar algum curso, assistir uma aula ou usar alguma funcionalidade? Nossa equipe está pronta para te ajudar.',
  },
  {
    icon: Bug,
    title: 'Reportar um problema',
    description: 'Encontrou algo que não está funcionando como deveria? Nos avise para que possamos corrigir o mais rápido possível.',
  },
  {
    icon: Lightbulb,
    title: 'Sugerir melhorias',
    description: 'Tem uma ideia para deixar a plataforma ainda melhor? Adoramos ouvir sugestões dos nossos alunos.',
  },
]

export default function SuportePage() {
  const whatsappUrl =
    'https://wa.me/5521990268273?text=Ol%C3%A1%2C%20sou%20aluno(a)%20do%20Franca%20Academy%20e%20gostaria%20de%20suporte.%20Como%20posso%20ser%20atendido(a)%3F'

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="page-title mb-1">Suporte</h1>
        <p className="page-subtitle">
          Estamos aqui para garantir a melhor experiência na sua jornada de aprendizado.
        </p>
      </div>

      {/* Reasons card */}
      <div className="card-static p-5 sm:p-8 mb-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center">
            <LifeBuoy size={20} className="text-brand-green-dark" />
          </div>
          <div>
            <h2 className="font-poppins text-[17px] font-semibold text-brand-navy">
              Como podemos ajudar?
            </h2>
            <p className="text-[13px] text-brand-navy-light-active mt-0.5">
              Nosso suporte atende nos seguintes casos:
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {supportReasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 p-4 rounded-xl bg-[#f7faf8] border border-black/[0.04]"
            >
              <div className="w-9 h-9 bg-brand-green-light rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <reason.icon size={18} className="text-brand-green-dark" />
              </div>
              <div>
                <h3 className="font-poppins text-[14px] font-semibold text-brand-navy mb-1">
                  {reason.title}
                </h3>
                <p className="text-[13px] text-brand-navy-light-active leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA card */}
      <div className="card-static p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center">
            <MessageCircle size={20} className="text-brand-green-dark" />
          </div>
          <div>
            <h2 className="font-poppins text-[17px] font-semibold text-brand-navy">
              Fale conosco pelo WhatsApp
            </h2>
            <p className="text-[13px] text-brand-navy-light-active mt-0.5">
              Atendimento rápido e humanizado.
            </p>
          </div>
        </div>

        <p className="text-[13px] text-brand-navy-light-active leading-relaxed mb-5">
          Ao clicar no botão abaixo, você será redirecionado para o nosso WhatsApp com uma mensagem
          já preenchida. É só enviar e aguardar o retorno da nossa equipe.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 text-[14px]"
        >
          <MessageCircle size={16} />
          Abrir WhatsApp
          <ExternalLink size={14} className="opacity-60" />
        </a>
      </div>
    </div>
  )
}
