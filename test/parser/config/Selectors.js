var selectors = {
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
    source:   'publico'
  },

  'http://expresso.sapo.pt/': {
    title:    '#detalheArtigoDefault h1',
    lead:     '#detalheArtigoDefault h2',
    body:     '#bodyText',
    image:    {
      url:          '#detalheArtigoDefault div.entre img',
      description:  '#detalheArtigoDefault div.entre div.aiCenterDesD',
      author:       '#detalheArtigoDefault div.entre div.aiCenterCreD',
    },

    author:   '#detalheArtigoDefault span.atigoFonte',
    source:   'expresso'    
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
    source:   'abola'    
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
    //tags:
    source:   'sicnoticias'     
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
  for (var host in selectors) {
    if (url.indexOf(host) == 0) {
      return selectors[host];
    }
  }
  return undefined;
}