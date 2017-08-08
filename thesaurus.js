module.exports = function(api, pluginInfo) {

	var options = pluginInfo.options;
	var $ = api.window.$;
	var m = window;

	function _init() {	
		m._editor.on("contextmenu", function(cm, e) {
			if(!e.ctrlKey) return;
			e.stopPropagation();
			e.stopImmediatePropagation();
			
			setTimeout(function(){
				var newContextMenu = new m.gui.Menu({
					'type': 'menubar'
				});	
				var word = getWordFromEditor();		
				if (!word || word.match(/^\s+$/)){
					return;
				}
				url = 'https://www.openthesaurus.de/synonyme/'+word+'?format=application/json';		
				callApi(url, function(data){

					data.synsets.forEach(function(synset){
						synset.terms.forEach(function(term){
							newContextMenu.append(new m.gui.MenuItem({
								label: term.term,
								click: function() {
									m._editor.replaceSelection(this.label);
								}
							}));
						});
					});
					newContextMenu.popup(e.x, e.y);
				});		
			}, 0);
		});
	}

	function callApi(url, callback) {
		$.getJSON(url, null).done(function(data) {
			callback(data);
		}).fail(function() {

		}).always(function() {

		});
	}

	function getWordFromEditor() {
		if (m._editor.somethingSelected()) {
			var q = m._editor.getSelection();
		} else {
			var w = m._editor.findWordAt(m._editor.getCursor());
			var q = m._editor.getRange(w.from(), w.to());
			m._editor.setSelection(w.from(), w.to());
		}
		return q;
	}


	return {
		_init: _init
	};
};
