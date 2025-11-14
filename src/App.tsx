import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import pageData from './page-data.json'

export default function App() {
  const page = pageData as any
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'small': return 'py-8 md:py-12'
      case 'medium': return 'py-12 md:py-16'
      case 'large': return 'py-16 md:py-24'
      case 'xlarge': return 'py-24 md:py-32'
      default: return 'py-16 md:py-24'
    }
  }

  const getScrollAnimation = (effect?: string) => {
    switch (effect) {
      case 'fade':
        return { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: '-100px' } }
      case 'slide':
        return { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' } }
      case 'zoom':
        return { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true, margin: '-100px' } }
      case 'parallax':
        return { initial: { opacity: 0, y: 100 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' } }
      default:
        return {}
    }
  }

  const getBackgroundStyle = (styles: any) => {
    const baseStyle: React.CSSProperties = {
      color: styles.textColor,
      position: 'relative',
      overflow: 'hidden'
    }

    if (styles.backgroundType === 'gradient') {
      const direction = styles.gradientDirection?.replace('to-', '') || 'br'
      return {
        ...baseStyle,
        background: `linear-gradient(to ${direction.replace('-', ' ')}, ${styles.gradientFrom || '#2563EB'}, ${styles.gradientTo || '#7C3AED'})`
      }
    }

    if (styles.backgroundType === 'mesh') {
      return {
        ...baseStyle,
        background: `radial-gradient(at 0% 0%, ${styles.gradientFrom || '#FF0080'} 0px, transparent 50%),
                     radial-gradient(at 100% 0%, ${styles.gradientVia || '#7928CA'} 0px, transparent 50%),
                     radial-gradient(at 100% 100%, ${styles.gradientTo || '#4158D0'} 0px, transparent 50%),
                     radial-gradient(at 0% 100%, ${styles.gradientFrom || '#FF0080'} 0px, transparent 50%)`,
        backgroundColor: '#000000'
      }
    }

    if (styles.backgroundType === 'pattern') {
      const patterns: Record<string, string> = {
        dots: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
        grid: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        lines: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
        circles: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.05) 40%, transparent 40%, transparent)',
        zigzag: 'linear-gradient(135deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(225deg, rgba(0,0,0,0.05) 25%, transparent 25%)',
        'diagonal-lines': 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
        hexagons: 'radial-gradient(circle at 0% 50%, rgba(0,0,0,0.05) 30%, transparent 30%), radial-gradient(circle at 100% 50%, rgba(0,0,0,0.05) 30%, transparent 30%)'
      }
      const pattern = patterns[styles.backgroundPattern] || patterns.dots
      return {
        ...baseStyle,
        backgroundColor: styles.backgroundColor || '#FFFFFF',
        backgroundImage: pattern,
        backgroundSize: styles.backgroundPattern === 'grid' ? '20px 20px' : '30px 30px'
      }
    }

    if (styles.backgroundType === 'image' && styles.backgroundImage) {
      return {
        ...baseStyle,
        backgroundImage: `url(${styles.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }

    return {
      ...baseStyle,
      backgroundColor: styles.backgroundColor
    }
  }

  const getPageBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minHeight: '100vh'
    }

    if (page.pageBackgroundType === 'gradient') {
      const direction = page.pageGradientDirection?.replace('to-', '') || 'br'
      if (page.pageGradientDirection === 'radial') {
        return {
          ...baseStyle,
          background: `radial-gradient(circle at center, ${page.pageGradientFrom || '#2563EB'}, ${page.pageGradientTo || '#7C3AED'})`
        }
      }
      return {
        ...baseStyle,
        background: `linear-gradient(to ${direction.replace('-', ' ')}, ${page.pageGradientFrom || '#2563EB'}, ${page.pageGradientTo || '#7C3AED'})`
      }
    }

    if (page.pageBackgroundType === 'mesh') {
      return {
        ...baseStyle,
        background: `radial-gradient(at 0% 0%, ${page.pageGradientFrom || '#FF0080'} 0px, transparent 50%),
                     radial-gradient(at 100% 0%, ${page.pageGradientVia || '#7928CA'} 0px, transparent 50%),
                     radial-gradient(at 100% 100%, ${page.pageGradientTo || '#4158D0'} 0px, transparent 50%),
                     radial-gradient(at 0% 100%, ${page.pageGradientFrom || '#FF0080'} 0px, transparent 50%)`,
        backgroundColor: '#000000'
      }
    }

    if (page.pageBackgroundType === 'pattern') {
      const patterns: Record<string, string> = {
        dots: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
        grid: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        lines: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
        circles: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.05) 40%, transparent 40%, transparent)',
        zigzag: 'linear-gradient(135deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(225deg, rgba(0,0,0,0.05) 25%, transparent 25%)',
        'diagonal-lines': 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
        hexagons: 'radial-gradient(circle at 0% 50%, rgba(0,0,0,0.05) 30%, transparent 30%), radial-gradient(circle at 100% 50%, rgba(0,0,0,0.05) 30%, transparent 30%)'
      }
      const pattern = patterns[page.pageBackgroundPattern] || patterns.dots
      return {
        ...baseStyle,
        backgroundColor: page.backgroundColor || '#FFFFFF',
        backgroundImage: pattern,
        backgroundSize: page.pageBackgroundPattern === 'grid' ? '20px 20px' : '30px 30px'
      }
    }

    if (page.pageBackgroundType === 'image' && page.pageBackgroundImage) {
      return {
        ...baseStyle,
        backgroundImage: `url(${page.pageBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
    }

    return {
      ...baseStyle,
      backgroundColor: page.backgroundColor
    }
  }

  const handleButtonClick = (action?: any) => {
    if (!action) return

    switch (action.type) {
      case 'scroll':
        if (action.target) {
          const element = document.querySelector(action.target)
          element?.scrollIntoView({ behavior: 'smooth' })
        }
        break
      case 'link':
        if (action.url) {
          window.open(action.url, '_blank')
        }
        break
      case 'download':
        if (action.url) {
          const a = document.createElement('a')
          a.href = action.url
          a.download = ''
          a.click()
        }
        break
    }
  }

  const pageBackgroundStyle = useMemo(() => getPageBackgroundStyle(), [])
  const sections = useMemo(() => page.sections || [], [])

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={pageBackgroundStyle}
      >
        <div className="text-center max-w-md" style={{ fontFamily: page.fontFamily || 'Inter' }}>
          <div className="flex justify-center mb-6">
            <div 
              className="rounded-full p-4"
              style={{ backgroundColor: page.primaryColor + '20' }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      stroke={page.primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: page.textColor }}>Thank You!</h2>
          <p className="text-lg opacity-80" style={{ color: page.textColor }}>
            We've received your information and will be in touch with you soon.
          </p>
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={pageBackgroundStyle}
      >
        <div className="w-full max-w-4xl" style={{ fontFamily: page.fontFamily || 'Inter' }}>
          <div className="text-center mb-12">
            {page.logo && (
              <div className="flex justify-center mb-8">
                <img 
                  src={page.logo} 
                  alt="Logo" 
                  className="h-16 md:h-20 object-contain"
                />
              </div>
            )}
            
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ color: page.primaryColor }}
            >
              {page.headline}
            </h1>
            
            {page.subheadline && (
              <p className="text-xl md:text-2xl mb-6 opacity-90" style={{ color: page.textColor }}>
                {page.subheadline}
              </p>
            )}
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80" style={{ color: page.textColor }}>
              {page.description}
            </p>
          </div>

          <div 
            className="rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-100"
            style={{ backgroundColor: 'white' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {(page.formFields || []).map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <label 
                    htmlFor={field.id}
                    className="block text-sm font-medium"
                    style={{ color: page.textColor }}
                  >
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 h-12 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold rounded-lg transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: page.accentColor,
                  color: 'white'
                }}
              >
                {isSubmitting ? 'Submitting...' : page.ctaText}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      style={pageBackgroundStyle}
    >
      <div style={{ fontFamily: page.fontFamily || 'Inter' }}>
        {sections.map((section: any) => {
          const SectionWrapper = section.styles.scrollEffect !== 'none' ? motion.section : 'section'
          const animProps = section.styles.scrollEffect !== 'none' 
            ? { ...getScrollAnimation(section.styles.scrollEffect), transition: { duration: 0.6, ease: 'easeOut' } }
            : {}

          return (
            <SectionWrapper
              key={section.id}
              {...animProps}
              id={section.type}
              className={getPaddingClass(section.styles.padding)}
              style={getBackgroundStyle(section.styles)}
            >
              {section.styles.backgroundType === 'video' && section.styles.backgroundVideo && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                >
                  <source src={section.styles.backgroundVideo} type="video/mp4" />
                </video>
              )}

              <div className="container mx-auto px-6 relative z-10">
                {section.type === 'hero' && (
                  <div className="max-w-4xl mx-auto text-center">
                    {page.logo && (
                      <motion.div 
                        className="flex justify-center mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <img src={page.logo} alt="Logo" className="h-16 object-contain" />
                      </motion.div>
                    )}
                    <motion.h1 
                      className="text-5xl md:text-7xl font-bold mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {section.content.headline}
                    </motion.h1>
                    {section.content.subheadline && (
                      <motion.p 
                        className="text-xl md:text-2xl mb-4 opacity-90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {section.content.subheadline}
                      </motion.p>
                    )}
                    {section.content.description && (
                      <motion.p 
                        className="text-lg md:text-xl mb-8 opacity-80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {section.content.description}
                      </motion.p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        className="text-lg px-8 h-14 rounded-lg transition-transform hover:scale-105"
                        style={{
                          backgroundColor: page.accentColor,
                          color: 'white'
                        }}
                        onClick={() => handleButtonClick(section.buttonAction)}
                      >
                        {section.content.ctaText}
                      </button>
                    </motion.div>
                  </div>
                )}

                {section.type === 'features' && (
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{color: section.styles.textColor || page.primaryColor}}>
                        {section.content.title}
                      </h2>
                      <p className="text-lg md:text-xl" style={{opacity: 0.8, color: section.styles.textColor}}>
                        {section.content.description}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      {(section.content.items || []).map((item: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-200"
                        >
                          <div className="mb-4 flex justify-center">
                            <div 
                              className="rounded-full p-4"
                              style={{ backgroundColor: page.primaryColor + '20' }}
                            >
                              <svg width="32" height="32" viewBox="0 0 256 256" fill={page.primaryColor}>
                                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === 'testimonials' && (
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-12" style={{color: section.styles.textColor}}>
                      {section.content.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {(section.content.items || []).map((item: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-200"
                        >
                          <div className="flex gap-1 mb-4">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <svg key={i} width="20" height="20" viewBox="0 0 256 256" fill={page.accentColor}>
                                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                              </svg>
                            ))}
                          </div>
                          <p className="text-lg mb-4 italic text-gray-700">"{item.quote}"</p>
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === 'text' && (
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                      {section.content.title}
                    </h2>
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content.body || '' }}
                    />
                  </div>
                )}

                {section.type === 'image' && (
                  <div className="max-w-5xl mx-auto">
                    {section.content.image && (
                      <img 
                        src={section.content.image} 
                        alt={section.content.caption || 'Image'} 
                        className="w-full rounded-2xl shadow-2xl"
                      />
                    )}
                    {section.content.caption && (
                      <p className="text-center mt-4 text-lg opacity-75">
                        {section.content.caption}
                      </p>
                    )}
                  </div>
                )}

                {section.type === 'video' && section.content.url && (
                  <div className="max-w-5xl mx-auto">
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                      <iframe
                        src={section.content.url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {section.type === 'stats' && (
                  <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                      {(section.content.items || []).map((item: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="text-center"
                        >
                          <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: page.primaryColor }}>
                            {item.value}
                          </div>
                          <div className="text-lg opacity-80">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === 'cta' && (
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                      {section.content.headline}
                    </h2>
                    {section.content.description && (
                      <p className="text-lg md:text-xl mb-8 opacity-80">
                        {section.content.description}
                      </p>
                    )}
                    <button
                      className="text-lg px-8 h-14 rounded-lg transition-transform hover:scale-105"
                      style={{
                        backgroundColor: page.accentColor,
                        color: 'white'
                      }}
                      onClick={() => handleButtonClick(section.buttonAction)}
                    >
                      {section.content.ctaText}
                    </button>
                  </div>
                )}

                {section.type === 'form' && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        {section.content.title || 'Get in Touch'}
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {(page.formFields || []).map((field: any) => (
                          <div key={field.id} className="space-y-2">
                            <label 
                              htmlFor={field.id}
                              className="block text-sm font-medium text-gray-900"
                            >
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                id={field.id}
                                value={formData[field.id] || ''}
                                onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <input
                                id={field.id}
                                type={field.type}
                                value={formData[field.id] || ''}
                                onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                placeholder={field.placeholder}
                                required={field.required}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 h-12 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 text-lg font-semibold rounded-lg transition-transform hover:scale-105"
                          style={{ 
                            backgroundColor: page.accentColor,
                            color: 'white'
                          }}
                        >
                          {isSubmitting ? 'Submitting...' : (section.content.submitText || page.ctaText)}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </SectionWrapper>
          )
        })}
      </div>
    </div>
  )
}