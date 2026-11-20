import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight, BarChart3, Braces, ChartNoAxesCombined, Check, ChevronLeft,
  ChevronRight, Database, FileImage, Layers3, Mail, Menu, Microscope,
  Search, ShieldCheck, Sparkles, Target, X,
} from 'lucide-react'
import {
  Area, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from 'recharts'
import './App.css'

const currentYear = new Date().getFullYear()

type ChartPoint = { name: string; value: number; value2?: number }
type PortfolioItem = {
  id: string
  title: string
  category: string
  description: string
  method: string
  application: string
  chartType: 'box' | 'violin' | 'scatter' | 'regression' | 'pca' | 'pcoa' | 'heatmap' | 'correlogram' | 'bar' | 'line' | 'multipanel'
  explanation: string
  results: string
  order: number
  primaryImage: string
  additionalImages: string[]
  data: ChartPoint[]
}

type SiteData = {
  brandName: string
  logo: string
  colors: { navy: string; blue: string }
  hero: {
    eyebrow: string
    title: string
    emphasis: string
    lead: string
    primaryButton: string
    secondaryButton: string
  }
  intro: string
  institution: { name: string; description: string; copyright: string }
  contact: { whatsapp: string; email: string; privacyText: string }
  socialLinks: { label: string; url: string }[]
}

type Service = { title: string; description: string; examples: string; icon: string }
type LibraryItem = { title: string; name: string; text: string }
type CategoryItem = { category: string }

async function loadJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/${path}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Não foi possível carregar ${path}:`, error)
    return fallback
  }
}

function resolveAsset(path: string) {
  if (!path) return ''
  if (/^(https?:|data:)/.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function ChartGraphic({ item, compact = false }: { item: PortfolioItem; compact?: boolean }) {
  if (item.primaryImage) {
    return <img className="portfolio-photo" src={resolveAsset(item.primaryImage)} alt={item.title} />
  }

  const height = compact ? 190 : 390
  const common = { stroke: '#b9c4d3', tick: { fill: '#718096', fontSize: 11 } }
  if (item.chartType === 'scatter' || item.chartType === 'pca' || item.chartType === 'pcoa' || item.chartType === 'regression') return (
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
  if (item.chartType === 'line') return (
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
  return (
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
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)
  const [comparison, setComparison] = useState(72)
  const [submitted, setSubmitted] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [library, setLibrary] = useState<LibraryItem[]>([])
  const [site, setSite] = useState<SiteData | null>(null)

  useEffect(() => {
    loadJson<PortfolioItem[]>('portfolio.json', []).then((items) =>
      setPortfolio(items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    )
    loadJson<CategoryItem[]>('categories.json', []).then((items) => setCategories(items.map((item) => item.category)))
    loadJson<Service[]>('services.json', []).then(setServices)
    loadJson<LibraryItem[]>('library.json', []).then(setLibrary)
    loadJson<SiteData>('site.json', {
      brandName: 'Horlem',
      logo: '',
      colors: { navy: '#111d38', blue: '#315bd6' },
      hero: {
        eyebrow: 'Análise e visualização de dados',
        title: 'Transforme seus dados em resultados que fazem sentido.',
        emphasis: 'fazem sentido.',
        lead: 'Análise estatística, tratamento de dados e gráficos profissionais para pesquisas, projetos e decisões mais fundamentadas.',
        primaryButton: 'Solicitar orçamento',
        secondaryButton: 'Explorar portfólio',
      },
      intro: 'Organizamos dados, escolhemos métodos adequados ao delineamento e transformamos resultados em figuras que comunicam com precisão.',
      institution: { name: 'Horlem Consultory', description: 'Análise estatística e visualização de dados.', copyright: 'Dados tratados com responsabilidade' },
      contact: { whatsapp: '', email: '', privacyText: 'Os dados do projeto não são publicados ou utilizados em demonstrações sem autorização.' },
      socialLinks: [],
    }).then((data) => {
      setSite(data)
      document.documentElement.style.setProperty('--navy', data.colors.navy)
      document.documentElement.style.setProperty('--blue', data.colors.blue)
    })
  }, [])

  if (!site) return null

  const portfolioCategories = ['Todos', ...categories]
  const filtered = category === 'Todos' ? portfolio : portfolio.filter((item) => item.category === category)

  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fields = ['name', 'email', 'whatsapp', 'project', 'area', 'analysis', 'deadline', 'description']
    const labels: Record<string, string> = { name: 'Nome', email: 'E-mail', whatsapp: 'WhatsApp', project: 'Tipo de projeto', area: 'Área', analysis: 'Análise desejada', deadline: 'Prazo', description: 'Descrição' }
    const lines = fields.map((field) => `${labels[field]}: ${String(data.get(field) || 'Não informado')}`)
    setSubmitted(true)
    const phone = site.contact.whatsapp.replace(/\D/g, '')
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento.\n\n${lines.join('\n')}`)}`
      : `https://wa.me/?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento.\n\n${lines.join('\n')}`)}`
    window.open(url, '_blank', 'noopener,noreferrer')
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

  const iconByName: Record<string, typeof BarChart3> = {
    bar: BarChart3, chart: ChartNoAxesCombined, layers: Layers3, database: Database,
    microscope: Microscope, target: Target,
  }

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Navegação principal">
          <button className="brand" onClick={() => scrollTo('inicio')} aria-label="Ir para o início">
            {site.logo
              ? <img className="brand-logo" src={resolveAsset(site.logo)} alt="" />
              : <span className="brand-mark"><ChartNoAxesCombined size={18} /></span>}
            <span>{site.brandName}</span>
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('servicos')}>Serviços</button>
            <button onClick={() => scrollTo('portfolio')}>Portfólio</button>
            <button onClick={() => scrollTo('graficos')}>Biblioteca</button>
            <button onClick={() => scrollTo('processo')}>Como funciona</button>
            <button className="nav-cta" onClick={() => scrollTo('orcamento')}>{site.hero.primaryButton} <ArrowRight size={15} /></button>
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
              <span className="eyebrow"><Sparkles size={14} /> {site.hero.eyebrow}</span>
              <h1>{site.hero.title.replace(site.hero.emphasis, '')}<em>{site.hero.emphasis}</em></h1>
              <p className="hero-lead">{site.hero.lead}</p>
              <div className="hero-actions">
                <button className="button primary" onClick={() => scrollTo('orcamento')}>{site.hero.primaryButton} <ArrowRight size={17} /></button>
                <button className="button secondary" onClick={() => scrollTo('portfolio')}>{site.hero.secondaryButton}</button>
              </div>
              <div className="proof-row"><span><Check size={15} /> Rigor metodológico</span><span><Check size={15} /> Entregas personalizadas</span></div>
            </motion.div>
            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .12 }}>
              <div className="visual-toolbar"><span>Exemplo demonstrativo</span><div><i /><i /><i /></div></div>
              <div className="chart-board"><div className="chart-head"><span>Desempenho por tratamento</span><small>Média ± IC 95%</small></div>
                {portfolio[3] ? <ChartGraphic compact item={portfolio[3]} /> : null}
              </div>
              <div className="mini-card mini-left"><small>Correlação</small><strong>r = 0,84</strong><span><i /> Associação positiva</span></div>
              <div className="mini-card mini-right"><small>Qualidade visual</small><strong>Alta resolução</strong><span>PNG · SVG · TIFF · PDF</span></div>
            </motion.div>
          </div>
        </section>

        <section className="intro container"><div className="section-kicker">De dados brutos à comunicação clara</div><p>{site.intro}</p></section>

        <section className="section" id="servicos">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">Serviços</span><h2>Uma solução completa para seus dados</h2></div><p>Do tratamento à interpretação, cada etapa é planejada para a finalidade da sua pesquisa ou projeto.</p></div>
            <div className="services-grid">
              {services.map((service) => {
                const Icon = iconByName[service.icon] || BarChart3
                return <article className="service-card" key={service.title}><div className="service-icon"><Icon size={20} /></div><h3>{service.title}</h3><p>{service.description}</p><small>{service.examples}</small><button onClick={() => scrollTo('orcamento')}>Conhecer serviço <ArrowRight size={14} /></button></article>
              })}
            </div>
          </div>
        </section>

        <section className="section portfolio-section" id="portfolio">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">Portfólio demonstrativo</span><h2>Gráficos que comunicam mais</h2></div><p>Exemplos criados para demonstrar possibilidades de análise e apresentação.</p></div>
            <div className="filter-row" aria-label="Filtros do portfólio">{portfolioCategories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
            <div className="portfolio-grid">
              {filtered.map((item) => (
                <motion.article layout className="portfolio-card" key={item.id}>
                  <button className="portfolio-chart" onClick={() => setSelected(item)} aria-label={`Ampliar ${item.title}`}>
                    <ChartGraphic item={item} compact /><span className="zoom-label"><Search size={14} /> Ampliar</span>
                  </button>
                  <div className="portfolio-info"><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><div><small>Método</small><strong>{item.method}</strong></div></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="graficos">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">Biblioteca de gráficos</span><h2>Escolha pela pergunta, não pela moda</h2></div><p>A representação visual adequada depende da estrutura dos dados e da mensagem que precisa ser comunicada.</p></div>
            <div className="library-grid">{library.map((item) => <article className="library-card" key={item.title}><span>{item.title}</span><h3>{item.name}</h3><p>{item.text}</p></article>)}</div>
          </div>
        </section>

        <section className="section compare-section">
          <div className="container compare-grid">
            <div className="compare-copy"><span className="section-kicker">Demonstração de qualidade</span><h2>Um gráfico profissional orienta a leitura</h2><p>Aqui, contexto, hierarquia e identificação correta fazem a diferença.</p><ul><li><Check size={16} /> Eixos e unidades identificados</li><li><Check size={16} /> Escalas metodologicamente adequadas</li><li><Check size={16} /> Legendas e intervalos explicados</li></ul></div>
            <div className="compare-card"><div className="compare-label"><span>Apresentação básica</span><span>Apresentação profissional</span></div><div className="compare-stage"><div className="before-chart"><span>Resultado A</span><div className="bare-bars"><i /><i /><i /><i /></div></div><div className="after-chart" style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}><div className="professional-chart"><span>Concentração por grupo (mg/L)</span><div className="pro-bars"><i /><i /><i /><i /></div></div></div><input aria-label="Comparar apresentações" type="range" min="20" max="80" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} /></div></div>
          </div>
        </section>

        <section className="section" id="processo">
          <div className="container"><div className="section-heading"><div><span className="section-kicker">Processo de trabalho</span><h2>Do primeiro envio à entrega organizada</h2></div></div><div className="process-grid">{[['01', 'Envie seus dados', 'Compartilhe a base e descreva o objetivo do projeto.'], ['02', 'Receba uma avaliação', 'Definimos necessidade, arquivos e orçamento personalizado.'], ['03', 'Análise e desenvolvimento', 'Executamos a análise e criamos as visualizações.'], ['04', 'Entrega final', 'Arquivos finais são organizados conforme o escopo contratado.']].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section deliverables-section">
          <div className="container"><div className="section-heading"><div><span className="section-kicker">Entregáveis</span><h2>Arquivos organizados para cada uso</h2></div><p>Os formatos disponíveis são definidos no orçamento e podem variar conforme o projeto.</p></div><div className="deliverables-grid">{[[FileImage, 'Imagens', 'PNG, TIFF e PDF'], [Braces, 'Arquivos editáveis', 'SVG e fontes do projeto'], [BarChart3, 'Resultados', 'Tabelas e relatório'], [Database, 'Dados preparados', 'Planilhas organizadas']].map(([Icon, title, text]: any) => <article key={title}><Icon size={22} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div>
        </section>

        <section className="section quote-section" id="orcamento">
          <div className="container quote-grid">
            <div className="quote-copy"><span className="section-kicker">Solicitar orçamento</span><h2>Conte um pouco sobre o seu projeto</h2><p>Não é preciso conhecer todos os métodos antes de entrar em contato. O escopo será definido a partir do delineamento e das suas necessidades.</p><div className="privacy-note"><ShieldCheck size={20} /><p><strong>Privacidade em primeiro lugar.</strong><br />{site.contact.privacyText}</p></div></div>
            <form className="quote-form" onSubmit={submitQuote}>
              <div className="form-row"><label>Nome *<input name="name" required placeholder="Seu nome" /></label><label>E-mail *<input name="email" type="email" required placeholder="nome@email.com" /></label></div>
              <div className="form-row"><label>WhatsApp<input name="whatsapp" type="tel" placeholder="(00) 00000-0000" /></label><label>Tipo de projeto<select name="project" defaultValue=""><option value="" disabled>Selecione</option><option>Artigo científico</option><option>Dissertação ou tese</option><option>Apresentação</option><option>Relatório empresarial</option><option>Dashboard</option><option>Outro projeto</option></select></label></div>
              <div className="form-row"><label>Área de atuação<input name="area" placeholder="Ex.: saúde, biologia, economia" /></label><label>Prazo esperado<select name="deadline" defaultValue=""><option value="">Sem urgência definida</option><option>Até 1 semana</option><option>Até 2 semanas</option><option>Até 1 mês</option><option>Mais de 1 mês</option></select></label></div>
              <label>Análise desejada<select name="analysis" defaultValue=""><option value="">Ainda não sei — pode ajudar na escolha</option><option>Criação de gráficos</option><option>Análise estatística</option><option>Análise multivariada</option><option>Tratamento de dados</option><option>Dashboard ou relatório</option></select></label>
              <label>Descreva sua necessidade<textarea name="description" rows={5} placeholder="Explique o objetivo, os grupos ou variáveis e o que precisa entregar." /></label>
              <button className="button primary full" type="submit">{submitted ? 'Abrir WhatsApp novamente' : 'Enviar solicitação pelo WhatsApp'} <ArrowRight size={17} /></button>
              <p className="form-status"><Mail size={13} /> Você será direcionado ao WhatsApp com os dados preenchidos. Revise antes de enviar.</p>
            </form>
          </div>
        </section>

        <section className="final-cta"><div className="container"><h2>Seus dados merecem uma apresentação à altura da sua pesquisa.</h2><button className="button light" onClick={() => scrollTo('orcamento')}>Solicitar orçamento <ArrowRight size={17} /></button></div></section>
      </main>

      <footer><div className="container footer-grid"><div><div className="brand footer-brand">{site.logo ? <img className="brand-logo" src={resolveAsset(site.logo)} alt="" /> : <span className="brand-mark"><ChartNoAxesCombined size={18} /></span>}<span>{site.brandName}</span></div><p>{site.institution.description}</p></div><div><strong>Serviços</strong><button onClick={() => scrollTo('servicos')}>Análise estatística</button><button onClick={() => scrollTo('servicos')}>Gráficos científicos</button><button onClick={() => scrollTo('servicos')}>Dashboards</button></div><div><strong>Site</strong><button onClick={() => scrollTo('portfolio')}>Portfólio</button><button onClick={() => scrollTo('orcamento')}>Orçamento</button><a href={`${import.meta.env.BASE_URL}privacidade.html`}>Privacidade</a></div></div><div className="container footer-bottom"><span>© {currentYear} {site.institution.name}</span><span>{site.institution.copyright}</span></div></footer>

      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
          <div className="modal"><div className="modal-header"><div><span>{selected.category}</span><h2>{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Fechar"><X /></button></div>
            <div className="modal-chart">{selected.primaryImage ? <img className="modal-photo" src={resolveAsset(selected.primaryImage)} alt={selected.title} /> : <ChartGraphic item={selected} />}</div>
            {selected.additionalImages?.length > 0 && <div className="additional-images">{selected.additionalImages.map((image) => <img key={image} src={resolveAsset(image)} alt={`${selected.title} - imagem adicional`} />)}</div>}
            <div className="modal-details"><div><p>{selected.description}</p>{selected.explanation && <p>{selected.explanation}</p>}</div><dl><div><dt>Aplicação</dt><dd>{selected.application}</dd></div><div><dt>Método demonstrado</dt><dd>{selected.method}</dd></div>{selected.results && <div><dt>Resultado</dt><dd>{selected.results}</dd></div>}</dl></div>
            <div className="modal-nav"><button onClick={() => navigateModal(-1)}><ChevronLeft size={18} /> Anterior</button><button onClick={() => navigateModal(1)}>Próximo <ChevronRight size={18} /></button></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
