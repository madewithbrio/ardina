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

  'http://desporto.publico.pt/': {
    title:  '#ctl00_ContentPlaceHolder1_titulo',
    lead:   '#ctl00_ContentPlaceHolder1_lead',
    body:   '#ctl00_ContentPlaceHolder1_texto',
    img:    '#ctl00_ContentPlaceHolder1_img',
    source: 'publico'  
  },

  'http://www.ionline.pt/': {
    title:  '#op-content-inner .pane-page-title h1',
    lead:   '#op-content-inner div.page-articledetail-entry div.field-item',
    body:   '#op-content-inner div.pane-node-body div.pane-content',
    img:    '#quicktabs-media_article .field-content img',
    source: 'ionline' 
  }
};


exports.getSelector = function(url) {
  for (var host in selectors) {
    if (url.indexOf(host) == 0) {
      return selectors[host];
    }
  }
  return undefined;
}