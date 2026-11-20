import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight, BarChart3, Braces, ChartNoAxesCombined, Check, ChevronLeft,
  ChevronRight, Database, FileImage, Layers3, Mail,
  Menu, Microscope, Search, ShieldCheck, Sparkles, Target, X,
} from 'lucide-react'
import {
  Area, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from 'recharts'
import './App.css'

type PortfolioItem = {
  id: number
  title: string
  category: string
  description: string
  method: string
  application: string
  type: 'scatter' | 'box' | 'line' | 'bar'
  data: { name: string; value: number; value2?: number }[]
}

const portfolio: PortfolioItem[] = [
  { id: 1, title: 'Ensaio de crescimento', category: 'Dados experimentais', description: 'Comparação visual de grupos com observações individuais e resumo central.', method: 'ANOVA com pós-hoc', application: 'Ensaios biológicos e experimentais', type: 'box', data: [{ name: 'Controle', value: 42 }, { name: 'Dose baixa', value: 55 }, { name: 'Dose alta', value: 68 }] },
  { id: 2, title: 'Relação entre indicadores', category: 'Correlação', description: 'Distribuição conjunta e força da associação entre duas variáveis.', method: 'Correlação de Pearson', application: 'Estudos observacionais', type: 'scatter', data: [{ name: '1', value: 18, value2: 21 }, { name: '2', value: 25, value2: 27 }, { name: '3', value: 31, value2: 33 }, { name: '4', value: 39, value2: 41 }, { name: '5', value: 48, value2: 52 }, { name: '6', value: 57, value2: 59 }] },
  { id: 3, title: 'Evolução temporal', category: 'Séries temporais', description: 'Tendência longitudinal com incerteza claramente identificada.', method: 'Modelo de tendência', application: 'Acompanhamento de indicadores', type: 'line', data: [{ name: 'Jan', value: 38, value2: 34 }, { name: 'Fev', value: 41, value2: 37 }, { name: 'Mar', value: 46, value2: 40 }, { name: 'Abr', value: 50, value2: 43 }, { name: 'Mai', value: 55, value2: 47 }, { name: 'Jun', value: 61, value2: 50 }] },
  { id: 4, title: 'Atividade por tratamento', category: 'Comparação entre grupos', description: 'Médias acompanhadas de intervalo e comparação entre condições.', method: 'Modelo linear', application: 'Pesquisa em saúde e biologia', type: 'bar', data: [{ name: 'A', value: 72 }, { name: 'B', value: 84 }, { name: 'C', value: 63 }, { name: 'D', value: 91 }] },
  { id: 5, title: 'Desempenho regional', category: 'Economia e indicadores', description: 'Painel comparativo de indicadores normalizados por região.', method: 'Análise descritiva', application: 'Relatórios e dashboards', type: 'bar', data: [{ name: 'Norte', value: 64 }, { name: 'Sudeste', value: 82 }, { name: 'Sul', value: 77 }, { name: 'Centro', value: 69 }] },
  { id: 6, title: 'Estrutura multivariada', category: 'Análise multivariada', description: 'Resumo visual de padrões em múltiplas variáveis.', method: 'PCA exploratória', application: 'Bases experimentais complexas', type: 'scatter', data: [{ name: 'PC1', value: 71, value2: 38 }, { name: 'PC2', value: 58, value2: 52 }, { name: 'PC3', value: 43, value2: 68 }, { name: 'PC4', value: 33, value2: 74 }, { name: 'PC5', value: 24, value2: 61 }, { name: 'PC6', value: 18, value2: 45 }] },
]

const categories = ['Todos', ...Array.from(new Set(portfolio.map((item) => item.category)))]

function ChartGraphic({ item, compact = false }: { item: PortfolioItem; compact?: boolean }) {
  const height = compact ? 190 : 390
  const common = { stroke: '#b9c4d3', tick: { fill: '#718096', fontSize: 11 } }
  if (item.type === 'scatter') return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 12, right: 18, bottom: 12, left: 4 }}>
        <CartesianGrid stroke="#edf1f6" />
        <XAxis dataKey="value" name="Valor" tick={common.tick} axisLine={common} tickLine={false} />
        <YAxis dataKey="value2" name="Resultado" tick={common.tick} axisLine={common} tickLine={false} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={item.data} fill="#315bd6" />
      </ScatterChart>
    </ResponsiveContainer>
  )
  if (item.type === 'line') return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={item.data} margin={{ top: 12, right: 16, bottom: 8, left: -18 }}>
        <CartesianGrid stroke="#edf1f6" vertical={false} />
        <XAxis dataKey="name" tick={common.tick} axisLine={common} tickLine={false} />
        <YAxis tick={common.tick} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value2" fill="#eef3ff" stroke="none" />
        <Line type="monotone" dataKey="value" stroke="#315bd6" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
  if (item.type === 'box') return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={item.data} margin={{ top: 12, right: 16, bottom: 8, left: -18 }}>
        <CartesianGrid stroke="#edf1f6" vertical={false} />
        <XAxis dataKey="name" tick={common.tick} axisLine={common} tickLine={false} />
        <YAxis tick={common.tick} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: '#f6f8fc' }} />
        <Bar dataKey="value" fill="#315bd6" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={item.data} layout="vertical" margin={{ top: 8, right: 18, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#edf1f6" horizontal={false} />
        <XAxis type="number" tick={common.tick} axisLine={common} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={common.tick} axisLine={false} tickLine={false} width={55} />
        <Tooltip cursor={{ fill: '#f6f8fc' }} />
        <Bar dataKey="value" fill="#315bd6" radius={[0, 5, 5, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)
  const [comparison, setComparison] = useState(72)
  const [submitted, setSubmitted] = useState(false)

  const filtered = category === 'Todos' ? portfolio : portfolio.filter((item) => item.category === category)

  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fields = ['name', 'email', 'whatsapp', 'project', 'area', 'analysis', 'deadline', 'description']
    const labels: Record<string, string> = { name: 'Nome', email: 'E-mail', whatsapp: 'WhatsApp', project: 'Tipo de projeto', area: 'Área', analysis: 'Análise desejada', deadline: 'Prazo', description: 'Descrição' }
    const lines = fields.map((field) => `${labels[field]}: ${String(data.get(field) || 'Não informado')}`)
    const files = event.currentTarget.querySelector<HTMLInputElement>('input[type=file]')?.files
    if (files?.length) lines.push(`Arquivo selecionado: ${files[0].name}`)
    setSubmitted(true)
    window.open(`https://wa.me/?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento.\n\n${lines.join('\n')}`)}`, '_blank', 'noopener,noreferrer')
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const navigateModal = (direction: number) => {
    if (!selected) return
    const index = filtered.findIndex((item) => item.id === selected.id)
    const next = (index + direction + filtered.length) % filtered.length
    setSelected(filtered[next])
  }

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Navegação principal">
          <button className="brand" onClick={() => scrollTo('inicio')} aria-label="Ir para o início">
            <span className="brand-mark"><ChartNoAxesCombined size={18} /></span>
            <span>Horlem</span>
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('servicos')}>Serviços</button>
            <button onClick={() => scrollTo('portfolio')}>Portfólio</button>
            <button onClick={() => scrollTo('graficos')}>Biblioteca</button>
            <button onClick={() => scrollTo('processo')}>Como funciona</button>
            <button className="nav-cta" onClick={() => scrollTo('orcamento')}>Solicitar orçamento <ArrowRight size={15} /></button>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <div className="container hero-grid">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
              <span className="eyebrow"><Sparkles size={14} /> Análise e visualização de dados</span>
              <h1>Transforme seus dados em resultados que <em>fazem sentido.</em></h1>
              <p className="hero-lead">Análise estatística, tratamento de dados e gráficos profissionais para pesquisas, projetos e decisões mais fundamentadas.</p>
              <div className="hero-actions">
                <button className="button primary" onClick={() => scrollTo('orcamento')}>Solicitar orçamento <ArrowRight size={17} /></button>
                <button className="button secondary" onClick={() => scrollTo('portfolio')}>Explorar portfólio</button>
              </div>
              <div className="proof-row">
                <span><Check size={15} /> Rigor metodológico</span>
                <span><Check size={15} /> Entregas personalizadas</span>
              </div>
            </motion.div>

            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .12 }}>
              <div className="visual-toolbar"><span>Exemplo demonstrativo</span><div><i /><i /><i /></div></div>
              <div className="chart-board">
                <div className="chart-head"><span>Desempenho por tratamento</span><small>Média ± IC 95%</small></div>
                <ChartGraphic compact item={portfolio[3]} />
              </div>
              <div className="mini-card mini-left">
                <small>Correlação</small><strong>r = 0,84</strong><span><i /> Associação positiva</span>
              </div>
              <div className="mini-card mini-right">
                <small>Qualidade visual</small><strong>Alta resolução</strong><span>PNG · SVG · TIFF · PDF</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="intro container">
          <div className="section-kicker">De dados brutos à comunicação clara</div>
          <p>Organizamos dados, escolhemos métodos adequados ao delineamento e transformamos resultados em figuras que comunicam com precisão — sem perder o contexto científico.</p>
        </section>

        <section className="section" id="servicos">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">Serviços</span><h2>Uma solução completa para seus dados</h2></div>
              <p>Do tratamento à interpretação, cada etapa é planejada para a finalidade da sua pesquisa ou projeto.</p>
            </div>
            <div className="services-grid">
              {[
                [BarChart3, 'Gráficos profissionais', 'Figuras claras, consistentes e ajustadas à publicação.', 'Artigos · teses · apresentações'],
                [ChartNoAxesCombined, 'Análise estatística', 'Métodos definidos conforme perguntas e estrutura dos dados.', 'Testes · modelos · efeito'],
                [Layers3, 'Análise multivariada', 'Exploração de padrões em bases complexas.', 'PCA · clustering · PERMANOVA'],
                [Database, 'Tratamento de dados', 'Limpeza, padronização e preparação para análise.', 'Planilhas · bases integradas'],
                [Microscope, 'Figuras científicas', 'Painéis multipainel prontos para contexto científico.', 'Alta resolução · vetorial'],
                [Target, 'Dashboards e relatórios', 'Indicadores organizados para acompanhar resultados.', 'Painéis · relatórios'],
              ].map(([Icon, title, description, examples]: any) => (
                <article className="service-card" key={title}>
                  <div className="service-icon"><Icon size={20} /></div>
                  <h3>{title}</h3><p>{description}</p><small>{examples}</small>
                  <button onClick={() => scrollTo('orcamento')}>Conhecer serviço <ArrowRight size={14} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section portfolio-section" id="portfolio">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">Portfólio demonstrativo</span><h2>Gráficos que comunicam mais</h2></div>
              <p>Exemplos conceituais criados para demonstrar possibilidades de análise e apresentação.</p>
            </div>
            <div className="filter-row" aria-label="Filtros do portfólio">
              {categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}
            </div>
            <div className="portfolio-grid">
              {filtered.map((item) => (
                <motion.article layout className="portfolio-card" key={item.id}>
                  <button className="portfolio-chart" onClick={() => setSelected(item)} aria-label={`Ampliar ${item.title}`}>
                    <ChartGraphic item={item} compact />
                    <span className="zoom-label"><Search size={14} /> Ampliar</span>
                  </button>
                  <div className="portfolio-info">
                    <span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p>
                    <div><small>Método</small><strong>{item.method}</strong></div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="graficos">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">Biblioteca de gráficos</span><h2>Escolha pela pergunta, não pela moda</h2></div>
              <p>A representação visual adequada depende da estrutura dos dados e da mensagem que precisa ser comunicada.</p>
            </div>
            <div className="library-grid">
              {[
                ['Comparação', 'Boxplot + observações', 'Útil para visualizar distribuição, mediana e observações individuais entre grupos.'],
                ['Relação', 'Dispersão com regressão', 'Adequado para investigar associação e identificar padrões ou influências.'],
                ['Evolução', 'Curva temporal', 'Apresenta mudanças ao longo do tempo sem comparar categorias indevidamente.'],
                ['Composição', 'Barras organizadas', 'Apresenta frequências ou resumos com escalas consistentes e contexto suficiente.'],
                ['Multivariada', 'PCA ou PCoA', 'Resumir padrões em muitos atributos quando as condições metodológicas são adequadas.'],
                ['Diagnóstico', 'Gráficos de resíduos', 'Avaliam premissas e ajudam a verificar a adequação de modelos estatísticos.'],
              ].map(([title, name, text]) => (
                <article className="library-card" key={title}><span>{title}</span><h3>{name}</h3><p>{text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section compare-section">
          <div className="container compare-grid">
            <div className="compare-copy">
              <span className="section-kicker">Demonstração de qualidade</span>
              <h2>Um gráfico profissional orienta a leitura</h2>
              <p>Aqui, contexto, hierarquia e identificação correta fazem a diferença — sem alterar o conteúdo dos dados.</p>
              <ul>
                <li><Check size={16} /> Eixos e unidades identificados</li>
                <li><Check size={16} /> Escalas metodologicamente adequadas</li>
                <li><Check size={16} /> Legendas e intervalos explicados</li>
              </ul>
            </div>
            <div className="compare-card">
              <div className="compare-label"><span>Apresentação básica</span><span>Apresentação profissional</span></div>
              <div className="compare-stage">
                <div className="before-chart"><span>Resultado A</span><div className="bare-bars"><i /><i /><i /><i /></div></div>
                <div className="after-chart" style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}>
                  <div className="professional-chart"><span>Concentração por grupo (mg/L)</span><div className="pro-bars"><i /><i /><i /><i /></div></div>
                </div>
                <input aria-label="Comparar apresentações" type="range" min="20" max="80" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="processo">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">Processo de trabalho</span><h2>Do primeiro envio à entrega organizada</h2></div>
            </div>
            <div className="process-grid">
              {[
                ['01', 'Envie seus dados', 'Compartilhe a base e descreva o objetivo do projeto.'],
                ['02', 'Receba uma avaliação', 'Definimos necessidade, arquivos e orçamento personalizado.'],
                ['03', 'Análise e desenvolvimento', 'Executamos a análise e criamos as visualizações.'],
                ['04', 'Entrega final', 'Arquivos finais são organizados conforme o escopo contratado.'],
              ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section deliverables-section">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">Entregáveis</span><h2>Arquivos organizados para cada uso</h2></div>
              <p>Os formatos disponíveis são definidos no orçamento e podem variar conforme o projeto.</p>
            </div>
            <div className="deliverables-grid">
              {[
                [FileImage, 'Imagens', 'PNG, TIFF e PDF'],
                [Braces, 'Arquivos editáveis', 'SVG e fontes do projeto'],
                [BarChart3, 'Resultados', 'Tabelas e relatório'],
                [Database, 'Dados preparados', 'Planilhas organizadas'],
              ].map(([Icon, title, text]: any) => <article key={title}><Icon size={22} /><div><h3>{title}</h3><p>{text}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="section quote-section" id="orcamento">
          <div className="container quote-grid">
            <div className="quote-copy">
              <span className="section-kicker">Solicitar orçamento</span>
              <h2>Conte um pouco sobre o seu projeto</h2>
              <p>Não é preciso conhecer todos os métodos antes de entrar em contato. O escopo será definido a partir do delineamento e das suas necessidades.</p>
              <div className="privacy-note"><ShieldCheck size={20} /><p><strong>Privacidade em primeiro lugar.</strong><br />Os dados do projeto não são publicados ou utilizados em demonstrações sem autorização.</p></div>
            </div>
            <form className="quote-form" onSubmit={submitQuote}>
              <div className="form-row">
                <label>Nome *<input name="name" required placeholder="Seu nome" /></label>
                <label>E-mail *<input name="email" type="email" required placeholder="nome@email.com" /></label>
              </div>
              <div className="form-row">
                <label>WhatsApp<input name="whatsapp" type="tel" placeholder="(00) 00000-0000" /></label>
                <label>Tipo de projeto<select name="project" defaultValue=""><option value="" disabled>Selecione</option><option>Artigo científico</option><option>Dissertação ou tese</option><option>Apresentação</option><option>Relatório empresarial</option><option>Dashboard</option><option>Outro projeto</option></select></label>
              </div>
              <div className="form-row">
                <label>Área de atuação<input name="area" placeholder="Ex.: saúde, biologia, economia" /></label>
                <label>Prazo esperado<select name="deadline" defaultValue=""><option value="">Sem urgência definida</option><option>Até 1 semana</option><option>Até 2 semanas</option><option>Até 1 mês</option><option>Mais de 1 mês</option></select></label>
              </div>
              <label>Análise desejada
                <select name="analysis" defaultValue="">
                  <option value="">Ainda não sei — pode ajudar na escolha</option><option>Criação de gráficos</option><option>Análise estatística</option><option>Análise multivariada</option><option>Tratamento de dados</option><option>Dashboard ou relatório</option>
                </select>
              </label>
              <label>Descreva sua necessidade<textarea name="description" rows={5} placeholder="Explique o objetivo, os grupos ou variáveis e o que precisa entregar." /></label>
              <label className="file-label">Anexar arquivo
                <input name="file" type="file" accept=".xlsx,.xls,.csv,.txt,.doc,.docx,.pdf" />
                <small>O arquivo será enviado por você no chat, não será publicado neste site.</small>
              </label>
              <button className="button primary full" type="submit">{submitted ? 'Abrir WhatsApp novamente' : 'Enviar solicitação pelo WhatsApp'} <ArrowRight size={17} /></button>
              <p className="form-status"><Mail size={13} /> Você será direcionado ao WhatsApp com os dados preenchidos. Revise antes de enviar.</p>
            </form>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <h2>Seus dados merecem uma apresentação à altura da sua pesquisa.</h2>
            <button className="button light" onClick={() => scrollTo('orcamento')}>Solicitar orçamento <ArrowRight size={17} /></button>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div><div className="brand footer-brand"><span className="brand-mark"><ChartNoAxesCombined size={18} /></span><span>Horlem</span></div><p>Análise estatística e visualização de dados.</p></div>
          <div><strong>Serviços</strong><button onClick={() => scrollTo('servicos')}>Análise estatística</button><button onClick={() => scrollTo('servicos')}>Gráficos científicos</button><button onClick={() => scrollTo('servicos')}>Dashboards</button></div>
          <div><strong>Site</strong><button onClick={() => scrollTo('portfolio')}>Portfólio</button><button onClick={() => scrollTo('orcamento')}>Orçamento</button><a href="/privacidade.html">Privacidade</a></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Horlem Consultory</span><span>Dados tratados com responsabilidade</span></div>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
          <div className="modal">
            <div className="modal-header"><div><span>{selected.category}</span><h2>{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Fechar"><X /></button></div>
            <div className="modal-chart"><ChartGraphic item={selected} /></div>
            <div className="modal-details"><p>{selected.description}</p><dl><div><dt>Aplicação</dt><dd>{selected.application}</dd></div><div><dt>Método demonstrado</dt><dd>{selected.method}</dd></div></dl></div>
            <div className="modal-nav"><button onClick={() => navigateModal(-1)}><ChevronLeft size={18} /> Anterior</button><button onClick={() => navigateModal(1)}>Próximo <ChevronRight size={18} /></button></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
