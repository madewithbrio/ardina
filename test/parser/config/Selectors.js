var selectors = {
  'http://www.publico.pt/': {
    title:  '#content .noticia-title h2',
    lead:   '#content .noticia-intro blockquote',
    body:   '#main-content .noticia',
    img:    '#content .noticia-img img',
    source: 'publico'
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