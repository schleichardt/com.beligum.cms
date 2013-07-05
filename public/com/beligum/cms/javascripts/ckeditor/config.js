/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config
	
	var CSS_PREFIX = '/assets/stylesheets';
	//this will also style the editor styles in the toolbar combobox
	/*
	 * Disabled for now cause the fonts were huge 
	 */
	/*
	CKEDITOR.config.contentsCss = [CSS_PREFIX+'/editor.css'];
	if ($('body').hasClass("museum")) {
		CKEDITOR.config.contentsCss.push(CSS_PREFIX+'/editor-museum.css');
	}
	else {
		CKEDITOR.config.contentsCss.push(CSS_PREFIX+'/editor-bb.css');
	}
	*/
	CKEDITOR.config.contentsCss = [CSS_PREFIX+'/editor-flat.css'];
	
	CKEDITOR.config.forcePasteAsPlainText = true;
	CKEDITOR.config.removeFormatTags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,canvas,caption,center,cite,code,col,colgroup,command,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1 to h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,map,mark,menu,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr';
	CKEDITOR.config.removeFormatAttributes = 'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,autofocus,autoplay,bgcolor,border,buffered,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,data,datetime,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,for,form,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,manifest,max,maxlength,media,method,min,multiple,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,pubdate,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,spellcheck,scope,scoped,seamless,selected,shape,size,sizes,span,src,srcdoc,srclang,start,step,style,summary,tabindex,target,title,type,usemap,value,width,wrap';
	
	//removes the "insert paragraph here" line
	CKEDITOR.config.removePlugins = 'magicline';
	
	CKEDITOR.config.stylesSet = 
	[
		{ name: 'Normal text',		element: 'p',		attributes: { 'class': '' } },
		{ name: 'Heading 1',		element: 'h1',		attributes: { 'class': '' } },
		{ name: 'Heading 2',		element: 'h2',		attributes: { 'class': '' } },
		{ name: 'Heading 3',		element: 'h3',		attributes: { 'class': '' } },
		{ name: 'Lead',				element: 'div',		attributes: { 'class': 'lead' } },
		{ name: 'Table 1',			element: 'div',		attributes: { 'class': 'pretty-table-1' } },
		{ name: 'Featurebox 1',		element: 'div',		attributes: { 'class': 'featured1' } },
		{ name: 'Featurebox 2',		element: 'div',		attributes: { 'class': 'featured2' } },
		{ name: 'Framed image 1',	element: 'div',		attributes: { 'class': 'framed-img-1' } },
		{ name: 'Framed image 2',	element: 'div',		attributes: { 'class': 'framed-img-2' } }
		//{ name: 'Quote',			element: 'div',		attributes: { 'class': 'quote' } },
		//{ name: 'Clear',			element: 'div',		attributes: { 'class': '' }, styles : { } }
	];
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//	CKEDITOR.config.extraPlugins = 'justify,htmlsnippet';
//	config.toolbar = [
//	              //	{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
//	              //	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
//	              //	{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
//	              //	{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
//	              //	{ name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
//	             // 	'/',
//	              	{ name: 'styles', items: ['Format' ] },
//	              //	{ name: 'tools', items: [ 'Maximize' ] }
//	              ];
//	

	// The toolbar groups arrangement, optimized for two toolbar rows.
//	config.toolbarGroups = [
//		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
//		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
//		{ name: 'links' },
//		{ name: 'insert' },
//		{ name: 'forms' },
//		{ name: 'tools' },
//		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
//		{ name: 'others' },
//		'/',
//		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
//		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
//		{ name: 'styles' },
//		{ name: 'colors' }
//	];

	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	//config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	//config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	//config.removeDialogTabs = 'image:advanced;link:advanced';
};
