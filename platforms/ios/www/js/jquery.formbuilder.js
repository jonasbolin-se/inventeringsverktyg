/**
 * jQuery Form Builder Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * http://www.botsko.net/blog/2009/04/jquery-form-builder-plugin/
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 */
(function ($) {
	$.fn.formbuilder = function (options) {
		// Extend the configuration options with user-provided
		var defaults = {
			main_form_id: false,
			save_url: false,
			load_url: false,
			control_box_target: false,
			serialize_prefix: 'frmb',
			css_ol_sortable_class : 'ol_opt_sortable',
			messages: {
				save				: "Spara",
				add_new_field		: "Lägg till ny fråga...",
				text				: "Textfält",
				title				: "Benämning",
				paragraph			: "Textarea",
				checkboxes			: "Flera alternativ - flera svar",
				radio				: "Flera alternativ - ett svar",
				select				: "Select List",
				text_field			: "Textfält",
				label				: "Label",
				paragraph_field		: "Textarea",
				select_options		: "Select Options",
				add					: "Lägg till",
				checkbox_group		: "Flera frågor - flera svar",
				remove_message		: "Säker på att du vill ta bort den här frågan?",
				remove				: "Ta bort",
				radio_group			: "Flera frågor - ett svar",
				selections_message	: "Tillåt flera svar",
				hide				: "Dölj",
				required			: "Obligatorisk",
				show				: "Visa",
				file 				: "Bild",
				file_text 			: "Bildnamn",
				headline			: "Rubrik - H2",


			}
		};
		var opts = $.extend(defaults, options);
		var frmb_id = 'frmb-' + $('ul[id^=frmb-]').length++;
		return this.each(function () {
			var ul_obj = $(this).append('<ul id="' + frmb_id + '" class="frmb"></ul>').find('ul');
			var field = '', field_type = '', last_id = 1, help, form_db_id;
			var FormName;
			// Add a unique class to the current element
			$(ul_obj).addClass(frmb_id);
			// load existing form data
			if (opts.load_url) {
				$.getJSON(opts.load_url, function(json) {
					form_db_id = json.form_id;
					fromJson(json.form_structure);
					FormName = json.form_name;
					$("#chk-list-name").val( FormName );
				});
			}

			if (opts.main_form_id) {
				$("#checklist").html(opts.main_form_id);
			}

			

			//console.log(FormName);


			// Create form control select box and add into the editor
			var controlBox = function (target) {
					var select = '';
					var box_content = '';
					var save_button = '';
					var box_id = frmb_id + '-control-box';
					var save_id = frmb_id + '-save-button';
					// Add the available options
					// select += '<option value="0">' + opts.messages.add_new_field + '</option>';
					// select += '<option value="input_text">' + opts.messages.text + '</option>';
					// select += '<option value="file">' + opts.messages.file + '</option>';
					// select += '<option value="textarea">' + opts.messages.paragraph + '</option>';
					// select += '<option value="headline">' + opts.messages.headline + '</option>';
					// select += '<option value="checkbox">' + opts.messages.checkboxes + '</option>';
					// select += '<option value="radio">' + opts.messages.radio + '</option>';
					//select += '<option value="select">' + opts.messages.select + '</option>';
					// Build the control box and search button content
					//box_content = '<select id="' + box_id + '" class="form-control">' + select + '</select>';
					save_button = '<input type="submit" id="' + save_id + '" class="frmb-submit btn btn-default" value="' + opts.messages.save + '"/>';
					// Insert the control box into page
					// if (!target) {
					// 	$(ul_obj).before(box_content);
					// } else {
					// 	$(target).append(box_content);
					//}
					// Insert the search button
					$(ul_obj).after(save_button);
					// Set the form save action
					$('#' + save_id).click(function () {
						save();
						return false;
					});
					// Add a callback to the select element
					$(".selectInput").click(function () {
						//console.log($(this).val());
						appendNewField($(this).val());
						$(this).val(0).blur();
						// This solves the scrollTo dependency
						$('html, body').animate({
							scrollTop: $('#frm-' + (last_id - 1) + '-item').offset().top
						}, 500);
						return false;
					});
				}(opts.control_box_target);
			// Json parser to build the form builder
			var fromJson = function (json) {
					var values = '';
					var options = false;
					// Parse json
					//console.log(json);
					$(json).each(function () {
						// checkbox type
						if (this.cssClass === 'checkbox') {
							options = [this.title];
							values = [];
							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						// radio type
						else if (this.cssClass === 'radio') {
							options = [this.title];
							values = [];

							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						// select type
						else if (this.cssClass === 'select') {
							options = [this.title, this.multiple];
							values = [];
							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						else {
							values = [this.values];
						}

						appendNewField(this.cssClass, values, options, this.required, this.id);
					});
				};
			// Wrapper for adding a new field
			var appendNewField = function (type, values, options, required, field_id) {
					field = '';
					field_type = type;
					if (typeof (values) === 'undefined') {
						values = '';
					}
					switch (type) {
					case 'input_text':
						appendTextInput(values, required, field_id);
						break;
					case 'textarea':
						appendTextarea(values, required, field_id);
						break;
					case 'headline':
						appendHeadline(values, required, field_id);
						break;
					case 'file':
						appendFileInput(values, required, field_id);
						break;
					case 'checkbox':
						appendCheckboxGroup(values, options, required, field_id);
						break;
					case 'radio':
						appendRadioGroup(values, options, required, field_id);
						break;
					case 'select':
						appendSelectList(values, options, required);
						break;
					}
				};
			// single line input type="text"
			var appendTextInput = function (values, required, field_id) {
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input name="' + field_id + '" class="fld-title" id="title-' + last_id + '" type="text" value="' + values + '" />';
					help = '';
					appendFieldLi(opts.messages.text, field, required, help, field_id);
				};
			// multi-line textarea
			var appendTextarea = function (values, required, field_id) {
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input name="' + field_id + '" type="text" value="' + values + '" />';
					help = '';
					appendFieldLi(opts.messages.paragraph_field, field, required, help, field_id);
				};

			// headline <h2>
			var appendHeadline = function (values, required, field_id) {
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input name="' + field_id + '" type="text" value="' + values + '" />';
					help = '';
					appendFieldLi(opts.messages.headline, field, required, help, field_id);
				};

			// fileinput field
			var appendFileInput = function (values, required, field_id) {
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input name="' + field_id + '" class="fld-title" id="title-' + last_id + '" type="text" value="' + values + '" />';
					help = '';
					appendFieldLi(opts.messages.file_text, field, required, help, field_id);
				};
			// adds a checkbox element
			var appendCheckboxGroup = function (values, options, required, field_id) {
					var title = '';
					if (typeof (options) === 'object') {
						title = options[0];
					}
					field += '<div class="chk_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					field += '<input type="text" id="' + field_id + '" name="title" value="' + title + '" /></div>';
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';

					field += '<div><ol class="' + opts.css_ol_sortable_class + '">';

					if (typeof (values) === 'object') {
						for (i = 0; i < values.length; i++) {
							field += checkboxFieldHtml(values[i]);
						}
					}
					else {
						field += checkboxFieldHtml('');
					}

					field += '<div class="add-area"><a href="#" class="add add_ck">' + opts.messages.add + '</a></div>';
					field += '</ol></div>';
					field += '</div>';
					field += '</div>';
					help = '';
					appendFieldLi(opts.messages.checkbox_group, field, required, help);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable.
				};
			// Checkbox field html, since there may be multiple
			var checkboxFieldHtml = function (values) {
					var checked = false;
					var value = '';
					if (typeof (values) === 'object') {
						value = values[0];
						checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
					}
					field = '<li>';
					field += '<div>';
					field += '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + ' />';
					field += '<input type="text" value="' + value + '" />';
					field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
					field += '</div></li>';
					return field;
				};
			// adds a radio element
			var appendRadioGroup = function (values, options, required, field_id) {
					var title = '';
					if (typeof (options) === 'object') {
						title = options[0];
					}
					field += '<div class="rd_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					//adding field_id which we'll save as the FormComponent ID in the database
					field += '<input type="text" id="' + field_id + '" name="title" value="' + title + '" /></div>';
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';

					field += '<div><ol class="' + opts.css_ol_sortable_class + '">';

					if (typeof (values) === 'object') {
						for (i = 0; i < values.length; i++) {
							field += radioFieldHtml(values[i], 'frm-' + last_id + '-fld');
						}
					}
					else {
						field += radioFieldHtml('', 'frm-' + last_id + '-fld');
					}

					field += '<div class="add-area"><a href="#" class="add add_rd">' + opts.messages.add + '</a></div>';
					field += '</ol></div>';
					field += '</div>';
					field += '</div>';
					help = '';
					appendFieldLi(opts.messages.radio_group, field, required, help, field_id);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable. 
				};
			// Radio field html, since there may be multiple
			var radioFieldHtml = function (values, name) {
					var checked = false;
					var value = '';
					if (typeof (values) === 'object') {
						value = values[0];
						checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
					}
					field = '<li>'; 
					field += '<div>';
					field += '<input type="radio"' + (checked ? ' checked="checked"' : '') + ' name="radio_' + name + '" />';
					field += '<input type="text" value="' + value + '" />';
					field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
					field += '</div></li>';

					return field;
				};
			// adds a select/option element
			var appendSelectList = function (values, options, required) {
					var multiple = false;
					var title = '';
					if (typeof (options) === 'object') {
						title = options[0];
						multiple = options[1] === 'true' || options[1] === 'checked' ? true : false;
					}
					field += '<div class="opt_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					field += '<input type="text" name="title" value="' + title + '" /></div>';
					field += '';
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';
					field += '<input type="checkbox" name="multiple"' + (multiple ? 'checked="checked"' : '') + '>';
					field += '<label class="auto">' + opts.messages.selections_message + '</label>';

					field += '<div><ol class="' + opts.css_ol_sortable_class + '">';

						if (typeof (values) === 'object') {
							for (i = 0; i < values.length; i++) {
								field += selectFieldHtml(values[i], multiple);
							}
						}
						else {
							field += selectFieldHtml('', multiple);
						}

					field += '<div class="add-area"><a href="#" class="add add_opt">' + opts.messages.add + '</a></div>';
					field += '</ol></div>';
					field += '</div>';
					field += '</div>';
					help = '';
					appendFieldLi(opts.messages.select, field, required, help);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable.  
				};
			// Select field html, since there may be multiple
			var selectFieldHtml = function (values, multiple) {
					if (multiple) {
						return checkboxFieldHtml(values);
					}
					else {
						return radioFieldHtml(values);
					}
				};
			// Appends the new field markup to the editor
			var appendFieldLi = function (title, field_html, required, help, field_id) {
					if (required) {
						required = required === 'checked' ? true : false;
					}
					var li = '';
					li += '<li id="frm-' + last_id + '-item" class="' + field_type + '">';
					li += '<div class="legend">';
					li += '<a id="frm-' + last_id + '" class="toggle-form" href="#">' + opts.messages.hide + '</a> ';
					li += '<a id="del_' + last_id + '" class="del-button delete-confirm" href="#" title="' + opts.messages.remove_message + '"><span>' + opts.messages.remove + '</span></a>';
					li += '<strong id="txt-title-' + last_id + '">' + title + '</strong></div>';
					li += '<div id="frm-' + last_id + '-fld" class="frm-holder">';
					li += '<div class="frm-elements">';
					li += '<div class="identifier" id="' + field_id +'">';
					//li += '<div class="frm-fld"><label for="required-' + last_id + '">' + opts.messages.required + '</label>';
					//li += '<input class="required" type="checkbox" value="1" name="required-' + last_id + '" id="required-' + last_id + '"' + (required ? ' checked="checked"' : '') + ' /></div>';
					li += field;
					li += '</div>';
					li += '</div>';
					li += '</div>';
					li += '</li>';
					$(ul_obj).append(li);
					$('#frm-' + last_id + '-item').hide();
					$('#frm-' + last_id + '-item').animate({
						opacity: 'show',
						height: 'show'
					}, 'slow');
					last_id++;
				};
			// handle field delete links
			$('.frmb').delegate('.remove', 'click', function () {
				$(this).parent('div').animate({
					opacity: 'hide',
					height: 'hide',
					marginBottom: '0px'
				}, 'fast', function () {
					$(this).remove();
				});
				return false;
			});
			// handle field display/hide
			$('.frmb').delegate('.toggle-form', 'click', function () {
				var target = $(this).attr("id");
				if ($(this).html() === opts.messages.hide) {
					$(this).removeClass('open').addClass('closed').html(opts.messages.show);
					$('#' + target + '-fld').animate({
						opacity: 'hide',
						height: 'hide'
					}, 'slow');
					return false;
				}
				if ($(this).html() === opts.messages.show) {
					$(this).removeClass('closed').addClass('open').html(opts.messages.hide);
					$('#' + target + '-fld').animate({
						opacity: 'show',
						height: 'show'
					}, 'slow');
					return false;
				}
				return false;
			});
			// handle delete confirmation
			$('.frmb').delegate('.delete-confirm', 'click', function () {
				var delete_id = $(this).attr("id").replace(/del_/, '');
				if (confirm($(this).attr('title'))) {
					$('#frm-' + delete_id + '-item').animate({ 
						opacity: 'hide',
						height: 'hide',
						marginBottom: '0px'
					}, 'slow', function () {
						$(this).remove();
					});
				}
				return false;
			});
			// Attach a callback to add new checkboxes
			$('.frmb').delegate('.add_ck', 'click', function () {
				$(this).parent().before(checkboxFieldHtml());
				return false;
			});
			// Attach a callback to add new options
			$('.frmb').delegate('.add_opt', 'click', function () {
				$(this).parent().before(selectFieldHtml('', false));
				return false;
			});
			// Attach a callback to add new radio fields
			$('.frmb').delegate('.add_rd', 'click', function () {
				$(this).parent().before(radioFieldHtml(false, $(this).parents('.frm-holder').attr('id')));
				return false;
			});
			// saves the serialized data to the server
			var save = function () {
				if (opts.save_url) {
					var blob = $(ul_obj).serializeFormList({prepend: opts.serialize_prefix});
					console.log(blob);
					$.ajax({
						type: "POST",
						url: opts.save_url,
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						data: blob,
						success: function (e) {
							console.log(e);
							alert("Checklista sparad!");
							window.location.href = "/formbuilder/" + e;

						}
					});
				}
			};
		});
	};
})(jQuery);
/**
 * jQuery Form Builder List Serialization Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Modified from the serialize list plugin
 * http://www.botsko.net/blog/2009/01/jquery_serialize_list_plugin/
 */
(function ($) {
	$.fn.serializeFormList = function (options) {
		// Extend the configuration options with user-provided
		var defaults = {
			prepend: 'ul',
			is_child: false,
			attributes: ['class']
		};
		var opts = $.extend(defaults, options);
		if (!opts.is_child) {
			opts.prepend = '&' + opts.prepend;
		}
		var serialStr = '';
		var jsonString = [];
		// Begin the core plugin
		this.each(function () {
			var ul_obj = this;
			var li_count = 0;
			var c = 1;

			$(this).children().each(function () {
				for (att = 0; att < opts.attributes.length; att++) {
					var key = (opts.attributes[att] === 'class' ? 'input_type' : opts.attributes[att]);
					//serialStr += opts.prepend + '[' + li_count + '][' + key + ']=' + encodeURIComponent($(this).attr(opts.attributes[att]));
					var elementJson = {};
					elementJson[key] = $(this).attr(opts.attributes[att]);
					
					// append the form field values
					if (opts.attributes[att] === 'class') {
						//serialStr += opts.prepend + '[' + li_count + '][required]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input.required').is(':checked'));
						//console.log($(this).attr(opts.attributes[att]));
						switch ($(this).attr(opts.attributes[att])) {
						case 'input_text':
							//serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
							elementJson['caption'] = $('#' + $(this).attr('id') + ' input[type=text]').val();
							elementJson['id'] = $('#' + $(this).attr('id') + ' input[type=text]').attr("name");
							break;
						case 'textarea':
							//serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
							elementJson['caption'] = $('#' + $(this).attr('id') + ' input[type=text]').val();
							elementJson['id'] = $('#' + $(this).attr('id') + ' input[type=text]').attr("name");
							break;
						case 'file':
							//serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
							elementJson['caption'] = $('#' + $(this).attr('id') + ' input[type=text]').val();
							elementJson['id'] = $('#' + $(this).attr('id') + ' input[type=text]').attr("name");
							break;
						case 'headline':
							//serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
							elementJson['caption'] = $('#' + $(this).attr('id') + ' input[type=text]').val();
							elementJson['id'] = $('#' + $(this).attr('id') + ' input[type=text]').attr("name");
							break;							
						case 'checkbox':
							c = 1;
							var inputOptions = new Array();
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($(this).attr('name') === 'title') {
									//serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									elementJson['caption'] = $(this).val();
									elementJson['id'] = $(this).attr('id');
								}
								else {
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
									inputOptions.push($(this).val());
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
								}
								c++;
							});
							elementJson['options'] = inputOptions;
							break;
						case 'radio':
							c = 1;
							var inputOptions = new Array();
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($(this).attr('name') === 'title') {
									//serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									elementJson['caption'] = $(this).val();
									elementJson['id'] = $(this).attr('id');

								}
								else {
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
									inputOptions.push($(this).val());
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
								}
								c++;
							});
							elementJson['options'] = inputOptions;
							break;
						case 'select':
							c = 1;
							serialStr += opts.prepend + '[' + li_count + '][multiple]=' + $('#' + $(this).attr('id') + ' input[name=multiple]').is(':checked');
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($(this).attr('name') === 'title') {
									serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									elementJson['caption'] = $(this).val();
								}
								else {
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
									//serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
								}
								c++;
							});
							break;
						}
					}
				}
				jsonString.push(elementJson);
				li_count++;
			});
		});
		var MainFormId = $("#checklist").html();
		var MainFormName = $("#checklist-name > input").val();
		console.log(MainFormId);
		console.log(MainFormName);
		console.log();
		result = {"form_id": MainFormId, "name": MainFormName};
		result['html'] = jsonString;
		

		// }
		return (JSON.stringify(result));

		
	};
})(jQuery);
