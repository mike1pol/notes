/**
Автор кода - Максим Чечель maximchick@gmail.com
Пожелания и предложения категорически приветствуются ;)
*/
var _leave_textarea = false;
var _count_colors = 5;
var _ex = null;
var _max_z = 0;
var _last_activity = (new Date()).getTime();

Sticker = function(text, posX, posY, color, id) {
	this.text = text;
	this.posX = posX;
	this.posY = posY;
	this.color = color;
	this.div_id = 0;
	this.current_color = color;
	this.save_state = false;
	this.id = '';

	if (typeof(id) == 'undefined')
		this.id = '';
	else
		this.id = id;

	this.focus = function() {
		_leave_textarea = true;
		this.textarea.focus();
	}

	this.nextColor = function(color) {
		this.div.toggleClassName('sticker_color' + this.current_color);

		if (++this.current_color == _count_colors)
			this.current_color = 0;

		this.div.toggleClassName('sticker_color' + this.current_color);
	}

	this.parseText = function(text) {
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');

		text = text.replace(/(^|[^\/])www\./g, "$1http://www.");

		//youtube
		text = text.replace(/http:\/\/www\.youtube\.com\/watch\?v=([^ &\n]+)/g,
			"<object width='425' height='344'><param name='movie' value='http://www.youtube.com/v/$1'></param><embed src='http://www.youtube.com/v/$1' type='application/x-shockwave-flash' width='425' height='344'></embed></object><br/>http://www.youtube.com/watch?v=$1");

		//fotki.yandex.ru
		text = text.replace(/http:\/\/fotki\.yandex\.ru([a-zA-Z0-9\/.-]+)\/users\/([^\/]+)\/view\/(\d+)([^\n ])/g,
			"<a target='_blank' href='http://fotki.yandex.ru$1/users/$2/view/$3$4'><img src='http://img-fotki.yandex.ru/getx/10000/photoface.181/$2_$3_XXXS' alt='http://fotki.yandex.ru$1/users/$2/view/$3$4'/></a>");

		//foto.mail.ru
		text = text.replace(/http:\/\/foto\.mail\.ru\/list\/([^\/]+)\/([^\/]+)\/(\d+)\.html/g,
			"<a target='_blank' href='http://foto.mail.ru/list/$1/$2/$3.html'><img src='http://content.foto.mail.ru/list/$1/$2/sp-$3.jpg' alt='http://foto.mail.ru/list/$1/$2/$3.html'/></a>");

		text = text.replace(/(^|[^'])(https?|ftp):\/\/([a-zA-Z0-9.-]+)\/([^ \n]{10})([^ \n]+)/g, 
			"$1<a target='_blank' href='$2://$3/$4$5'>$3/$4...</a>");

		text = text.replace(/(^|[^'])(https?|ftp):\/\/([a-zA-Z0-9.-]+)([^ \n]*)/g, 
			"$1<a target='_blank' href='$2://$3$4'>$3$4</a>");

		var arr = 0;
		var reg = /href='([^\/][^']+)'/g
		var link = '';
		var re_link = '';
		
		while (arr = reg.exec(text)) {
			link = arr[1];
			re_link = link.replace(/(\.|\?|\\)/g, "\\$1");
			text = text.replace(
				new RegExp("href='"+re_link+"'", "m"), 
				"href='/go/?link="+escape(link)+"'"
			);
		}
		
		//E-mail
		text = text.replace(/([a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,5})/g, 
			"<a href='mailto:$1'>$1</a>");

		text = text.replace(/\n/g, "<br/>");
		text = text.replace(/<br\/> +/g, "<br/>&nbsp;");
		return text;
	}

	this.show = function() {
		div = new Element('div');
		this.div = div;
		div.toggleClassName('sticker');
		div.toggleClassName('sticker_color' + this.current_color);

		this.div_id = 'div_'+Math.round(Math.random()*1000000);
		div.setAttribute('id', this.div_id);
		div.style.zIndex = _max_z++;
		div.style.left = parseInt(this.posX)+'px';
		div.style.top = parseInt(this.posY)+'px';
		div.onclick = function() {
			this.sticker.div.style.zIndex = ++_max_z;
		}
		div.sticker = this;
//toolbar
		toolbar = new Element('div');
		toolbar.toggleClassName('toolbar');
//colorpicker
		colorpicker = new Element('div');
		colorpicker.sticker = this;
		colorpicker.toggleClassName('colorpicker');

		colorpicker.onclick = function(e) {
			this.sticker.nextColor();
		}

		colorpicker.onmouseout = function(e) {
			this.sticker.save();
		}

		toolbar.appendChild(colorpicker);

//close button
		closebutton = new Element('img');
		closebutton.sticker = this;
		closebutton.setAttribute('src', closeIMG);

		closebutton.onclick = function () {
			this.sticker.remove();
		}

		toolbar.appendChild(closebutton);

		div.appendChild(toolbar);

		textarea = new Element('textarea');
		textarea.toggleClassName('edit_in_place');
		textarea.setAttribute('cols', 10);
		textarea.setAttribute('rows', 1);
		textarea.setAttribute('wrap', 'soft');
		textarea.value = this.text;
		textarea.sticker = this;

		this.textarea = textarea;

		textarea.getCols = function() {
			lines = this.value.split('\n');
			max_length = 0;
			for (var x = 0; x < lines.length; x++) 
				if (lines[x].length > max_length)
					max_length = lines[x].length;

			if (max_length < 7)
				return 10;
			else
				return max_length + 4;
		}

		textarea.getRows = function() {
			return this.value.split('\n').length;
		}

		textarea.onkeyup = function (e) {
			this.redraw();

			if (this.refresh) {
				if (Prototype.Browser.Gecko) {
					this.sticker.div.style.height = null;
					this.sticker.div.style.width = null;
				}
				this.sticker.div.style.display = 'inline';
			}

			e = e||window.event;

			if (27 == e.keyCode) {
				if (!this.value)
					return this.sticker.remove();

				this.value = this.sticker.text;
				this.onblur();
				_leave_textarea = false;
			}
		}

		textarea.onkeydown = function (e) {
			e = e || window.event;
			this.oldcols = this.cols;
			if (this.refresh = (8 == e.keyCode)) {
				if (Prototype.Browser.Gecko) {
					this.sticker.div.style.height = (this.sticker.div.getHeight() -2 )+'px';
					this.sticker.div.style.width = (this.sticker.div.getWidth() -2 )+'px';
				}

				this.sticker.div.style.display = 'block';
			}
		}

		textarea.redraw = function() {
			this.setAttribute('cols', this.getCols());
			this.setAttribute('rows', this.getRows());
		}
		
		textarea.onblur = function(e) {
			_leave_textarea = true;
			if (this.value) {
				this.sticker.save();
				this.sticker.container.innerHTML = this.sticker.parseText(this.value);
				this.sticker.wrapper.replaceChild(this.sticker.container, this);
			} else
				this.sticker.remove();
		}

		container = new Element('div');
		container.toggleClassName('edit_in_place');
		container.sticker = this;
		this.container = container;

		container.innerHTML = this.parseText(this.text);

		wrapper = new Element('div');
		this.wrapper = wrapper;
		wrapper.sticker = this;

		wrapper.container = container;
		wrapper.toggleClassName('wrapper');
		wrapper.appendChild(container);
		wrapper.onclick = function (e) {
			e = e || window.event;
			this.sticker.div.style.zIndex = ++_max_z;
			if (Event.element(e).tagName != 'DIV') 
				return;

			this.sticker.showEditor();
		}

		div.appendChild(wrapper);
		document.body.appendChild(div);

		var div_id = this.div_id;
		this.draggable = new Draggable(div_id, { 
			onEnd : function() {
				if (! $(div_id))
					return;

				//Если стикер был пермещён на закладку
				if (!$(div_id).sticker.textarea.value)
					$(div_id).sticker.remove();
				else 
					$(div_id).sticker.save();
			},
			onDrag : function() {
				$(div_id).dragged = true;
			}
		});
	}

	this.showEditor = function () {
		if (this.div.dragged) {
			this.div.dragged = false;
			return;
		}
		this.textarea.value = this.text;
		this.wrapper.replaceChild(this.textarea, this.container);
		this.textarea.redraw();
			
		this.textarea.focus();
		this.textarea.focus();
		if (Prototype.Browser.IE)
			setSelRange(this.textarea, this.textarea.value.length, 0);
	}

	this.save = function() {
		if (this.save_state || !this.is_changed())
			return;

		this.save_state = true;
		var div_id = this.div_id;

		if (! this.div_id) {
			var newX = posX;
			var newY = posY;
		} else {
			var newX = parseInt(this.div.style.left);
			var newY = parseInt(this.div.style.top);
		}

		new Ajax.Request(saveURL, {
			parameters: {
				'id': this.id,
				'text': UTF8.encode(this.textarea.value),
				'x':  newX / _ex,
				'y':  newY / _ex,
				'color': this.current_color,
				'board': board
			},
			onSuccess: function(transport) {
				if (transport.responseText.match(/^\d+$/)) 
					$(div_id).sticker.id = transport.responseText;
				else
					alert('Не удалось сохранить записочку');

				if (div_id) {
					$(div_id).sticker.save_state = false;
					$(div_id).sticker.text = $(div_id).sticker.textarea.value;
					$(div_id).sticker.posX = parseInt($(div_id).style.left);
					$(div_id).sticker.posY = parseInt($(div_id).style.top);
					$(div_id).sticker.color = $(div_id).sticker.current_color;
				}
  		}
		});
	}

	this.is_changed = function() {
		if ('' == this.id)
			return true;

		var state =  (
			(this.text != this.textarea.value) || 
			(this.posX != parseInt(this.div.style.left)) ||
			(this.posY != parseInt(this.div.style.top)) ||
			(this.color != this.current_color)
		);

		return state;
	}

	this.remove = function() {
		this.div.remove();
	if(this.id)
			new Ajax.Request(deleteURL, {
			parameters: {
				'id': this.id,
				'board': board
			},
			onSuccess: function(transport) {
				if (transport.responseText.match(/^\d+$/)) 
					$(div_id).sticker.id = transport.responseText;
				else
					alert('Не удалось сохранить записочку');

				if (div_id) {
					$(div_id).sticker.save_state = false;
					$(div_id).sticker.text = $(div_id).sticker.textarea.value;
					$(div_id).sticker.posX = parseInt($(div_id).style.left);
					$(div_id).sticker.posY = parseInt($(div_id).style.top);
					$(div_id).sticker.color = $(div_id).sticker.current_color;
				}
  		}
		});

	}
}

function setSelRange(inputEl, selStart, selEnd) { 
 if (inputEl.setSelectionRange) { 
  inputEl.focus(); 
  inputEl.setSelectionRange(selStart, selEnd); 
 } else if (inputEl.createTextRange) { 
  var range = inputEl.createTextRange(); 
  range.collapse(true); 
  range.moveEnd('character', selEnd); 
  range.moveStart('character', selStart); 
  range.select(); 
 } 
}

function glueStickers() {
	var textareas = $('stickers').getElementsByTagName('textarea');
	var sticker = null;
	_ex = $('em_x').getWidth();

	for (var i=0; i < textareas.length; i++) {
		textarea = textareas[i];
		sticker = new Sticker(
			textarea.value,
			Math.round(parseFloat(textarea.style.left)*_ex),
			Math.round(parseFloat(textarea.style.top)*_ex),
			textarea.style.zIndex,
			textarea.getAttribute('id').substring(1) //s
		);

		sticker.show();
	}

	$('current_tab').onclick = editTabTitle;

	var boards = $('menu').getElementsByClassName('page');

	if (boards.length) {
		for (i = 0; i< boards.length; i++) {
			Droppables.add(boards[i], {
				hoverclass: 'droppable',
				onDrop: dropSticker
			});
		}
	}
}

function dropSticker(sticker_div, tab) {
	var sticker = sticker_div.sticker;
	var old_board = board;
	
	board = tab.getElementsByTagName('a')[0].getAttribute('href').substring(1);

	sticker.div_id = ''; //чтобы брались старые координаты при сохранении
	sticker.save();
	sticker.draggable.destroy();
	sticker.div.remove();

	board = old_board;

	return true;
}

function editTabTitle(e) {
	var el = Event.element(e);

	tab_title = new Element('input');
	tab_title.setAttribute('type', 'text');
	tab_title.setAttribute('value', el.innerHTML);
	tab_title.old_value = el.innerHTML;

	tab_title.onblur = function(e) {
		if (!this.value) 
			this.value = this.old_value;
		
		span = new Element('span');
		span.innerHTML = this.value;
		span.onclick = editTabTitle;
		this.parentNode.replaceChild(span, this);
		_leave_textarea = true;
		if (this.old_value != this.value) {
			new Ajax.Request(renameBoardURL, {
				parameters: {
					'title': UTF8.encode(this.value)
				}
			});

			document.title = this.value;

			this.old_value = this.value;
		}
	}

	this.parentNode.replaceChild(tab_title, el);
	tab_title.focus();
}

function addNewBoard() {
	var name = prompt('Как назовём новую страницу?');
	if (name) {
		new Ajax.Request(newBoardURL, {
			parameters: {
				'title': UTF8.encode(name)
			},
			onSuccess: function(transport) {
				if (transport.responseText.match(/^\//)) 
					window.location = transport.responseText;
				else
					alert('Не удалось создать страницу');
  		}
		});
	}
}

function removeBoard(e) {
	if (!confirm('УДАЛИТЬ страницу и все её записочки ?'))
		return false;
	
	new Ajax.Request(removeBoardURL, {
		onSuccess: function(transport) {
			if (transport.responseText.match(/^\//)) 
				window.location = transport.responseText;
			else
				alert('Не удалось удалить страницу');
  		}
	});
}

document.onclick = function (e) {
	e = e || window.event;

	_last_activity = (new Date()).getTime();

	if (Event.element(e).tagName == "HTML") {
		if (_leave_textarea) {
			_leave_textarea = false;
		} else {
			var sticker = new Sticker('', Event.pointerX(e), Event.pointerY(e), 0);
			sticker.show();
			sticker.showEditor();
		}
	}
}

function showWindow(title, url, width, height) {
	win = new Window({
		className: "bluelighting", 
		title: title, 
		width: width, 
		height: height, 
		destroyOnClose: true,
		resizable:false,
		minimizable: false,
		maximizable: false,
		draggable:false,
		recenterAuto:true,
		effectOptions: {duration: null},

		zIndex: _max_z+1
	});

	win.setAjaxContent(url, null, true, true);
	return false;
}

function registration() {
	$($('ajax').getElementsByTagName('form')[0]).request({
		onComplete: function(transport) {
			$('ajax').replace(transport.responseText);
		}
	});

	return false;
}

function subscribe_to_board() {
	new Ajax.Request(subscribeBoardURL+'/'+($('subscribe').checked?'1':'0'));
}

function refreshPage() {
	var cur_time = (new Date()).getTime();

	if (_last_activity + _refresh_timeout < cur_time) {
		var loc = window.location;
		window.location = loc;
	} else {
		setTimeout('refreshPage()', _refresh_timeout * 1000);
	}
}

refreshPage();