var selectors = {
  'http://noticias.sapo.pt/': {
    title:    '#mainNewsTitle h1.entry-title',
    lead:     '.story p.lead',
    body:     '.story div.entry-content',
    image:    {
      url:          '.story .photo img',
      description:  '.story .photo .caption',
      author:       '#not_exists',
    },

    author:   '.story p.author',
    tags:     '.story ul.tags',
    source:   'sapo'
  },

  'http://rr.sapo.pt/': {
    title:    '#mainNewsTitle h1',
    lead:     '#mainLead',
    body:     '#textNews',
    image:    {
      url:          '.imgNews img',
      description:  '#legenda',
      author:       '#not_exists',
    },
    author:   '#dateSignature > span',
    tags:     '#not_exists',
    source:   'rr'
  },

  'http://www.publico.pt/': {
    title:    'article header h1',
    lead:     'article header div[itemprop="description"]',
    body:     'article div[itemprop="articleBody"]',
    image:    {
      url:          'article figure img[itemprop="image"]',
      description:  'article figure figcaption',
      author:       'article figure figcaption span.credit',
    },

    author:   'article header span[itemprop="author"] span[itemprop="name"]',
    tags:     '',
    source:   'publico'
  },

  'http://expresso.sapo.pt/': {
    title:    '#detalheArtigoDefault h1',
    lead:     '#detalheArtigoDefault h2',
    body:     '#bodyText',
    image:    {
      url:          '#detalheArtigoDefault div.entre img',
      description:  '#detalheArtigoDefault div.entre div.aiCenterCreD',
      author:       '#detalheArtigoDefault div.entre div.aiCenterDesD',
    },

    author:   '#detalheArtigoDefault span.atigoFonte',
    tags:     '',
    source:   'expresso',
    enconding:'binary'
  },

  'http://www.expresso.pt/': {
    alias: 'http://expresso.sapo.pt/',
  },

  'http://www.abola.pt/': {
    title:    '#a5g2',
    lead:     '#not_exists',
    body:     '#noticiatext',
    image:    {
      url:          '#ctl00_ContentPlaceHolder1_ver1_rpNoticia_ctl00_foto',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '#a5g4 > b',
    tags:     '',
    source:   'abola'    
  },

  'http://www.record.xl.pt/': {
    title:    '.maincontain .titulo',
    lead:     '.maincontain .sub',
    body:     '.maincontain .texto',
    image:    {
      url:          '#mod_fv img',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '.destacados_line_link',
    tags:     '.socialcontain .tags',
    source:   'record'
  },

  'http://sicnoticias.sapo.pt/': {
    title:    '#main div.column-1 h1',
    lead:     '#main div.column-1 h2',
    body:     '#main div.column-1 div.body',
    image:    {
      url:          '#main div.column-1 div.imageContainer img',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '#not_exists',
    tags:     '',
    source:   'sicnoticias'     
  },

  'http://www.jn.pt/': {
    title:    '#NewsTitle',
    lead:     '#NewsSummary',
    body:     '#Article div div',
    image:    {
      url:          '#Article div table img',
      description:  '#Article .MediaCaption',
      author:       '#Article .MediaProducer',
    },

    author:   '.Author',
    tags:     '.header-seccao-laranja2 a:first-child',
    source:   'jn'
  },

  'http://www.dn.pt/': {
    title:    '#NewsTitle',
    lead:     '#NewsSummary',
    body:     '#Article div div',
    image:    {
      url:          '#Article div table img',
      description:  '#Article .MediaCaption',
      author:       '#Article .MediaProducer',
    },

    author:   '.Author',
    tags:     '.header-seccao-laranja2 a:first-child',
    source:   'dn'
  },

  'http://www.tsf.pt/': {
    title:    '',
    lead:     '',
    body:     '',
    image:    {
      url:          '',
      description:  '',
      author:       '',
    },

    author:   '',
    tags:     '',
    source:   'tsf'
  },

  'http://sol.sapo.pt/' : {
    title:    '#NewsTitle',
    lead:     '#not_exists',
    body:     '#NewsSummary',
    exclude_body: 'div.tags',
    image:    {
      url:          '#NewsMain img',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '#not_exists',
    tags:     '#NewsSummary .tags > a',

    source:   'sol',
    enconding:'binary'
  },

  'http://www.sol.pt/' : {
    alias: 'http://sol.sapo.pt/',
  },

  'http://www.cmjornal.xl.pt/': {
    title:    '.newsPageContainer h4',
    lead:     '.newsPageContainer .newsPageContainer',
    body:     '.newsPageContainer',
    image:    {
      url:          '.newsPageContainer img',
      description:  '.imgLabel span',
      author:       '#not_exists',
    },

    author:   '#not_exists',
    tags:     '#not_exists',
    source:   'cm'
  },

  'http://www.jornaldenegocios.pt/': {
    title:    '.general_list_title2',
    lead:     '.com_shownews_lead',
    body:     '.com_shownews_text',
    image:    {
      url:          '.com_shownews_text img',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '.destacados_line_link',
    tags:     '#tags span a',
    source:   'negocios'
  },

  'http://economico.sapo.pt/': {
    title:    '.meta > h2',
    lead:     '.mainText p > strong',
    body:     '.mainText',
    exclude_body: 'p:first-child > strong',
    image:    {
      url:          '#not_exists',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '.meta em[property="dc.creator"]',
    tags:     '.meta strong',
    source:   'de'
  },

  'http://www.agenciafinanceira.iol.pt/': {
    title:    '.veryfirst-frame h1',
    lead:     '.veryfirst-frame h2',
    body:     '.first-frame',
    date:     'ul.date > li:nth-child(2) > span',
    exclude_body: 'iframe,script,.votes-row,.row',
    image:    {
      url:          '#mod_fv img',
      description:  '#not_exists',
      author:       '#not_exists',
    },

    author:   '.destacados_line_link',
    tags:     '.names a',
    source:   'agenciafinanceira'
  },


/**
  'http://www.ionline.pt/': {
    title:  '#op-content-inner .pane-page-title h1',
    lead:   '#op-content-inner div.page-articledetail-entry div.field-item',
    body:   '#op-content-inner div.pane-node-body div.pane-content',
    img:    '#quicktabs-media_article .field-content img',
    source: 'ionline' 
  }
**/
};


exports.getSelector = function(url) {
  if (typeof url === 'undefined') return;
  for (var urlStart in selectors) {
    if (url.indexOf(urlStart) == 0) {
      var selector = selectors[urlStart];
      if (typeof selector.alias === 'string') {
        var alias = selector.alias;
        selector = selectors[alias];
        selector.host = alias;
        selector.url  = url.replace(urlStart, alias);
      } else {
        selector.host = urlStart;
        selector.url  = url;
      }
      return selector;
    }
  }
  return;
}
