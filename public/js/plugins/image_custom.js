/**
 * Created by nant on 16/8/5.
 */
(function ($) {
  // Add an option for your plugin.
  $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    myOption: false
  });

  // Define the plugin.
  // The editor parameter is the current instance.
  $.FroalaEditor.PLUGINS.imageCustom = function (editor) {

    /**
     * support canvas or not
     *
     * @returns {boolean}
     */
    function isCanvasSupported() {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }

    /**
     * convert base64 to blob
     *
     * @param dataURI
     * @returns {*}
     */
    function dataURItoBlob(dataURI, fileType) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: fileType});
    }

    /**
     * read file by FileReader
     *
     * @param file
     */
    function readFile(file) {
      var reader = new FileReader();
      reader.onloadend = function () {
        processFile(reader.result, file.type, file.name);
      };
      reader.onerror = function () {
        alert('There was an error reading the file!');
      };

      reader.readAsDataURL(file);
    }

    /**
     * process file
     * with compression function
     *
     * @param dataURL
     * @param fileType
     */
    function processFile(dataURL, fileType, fileName) {
      var maxWidth = 800;
      var maxHeight = 800;

      var image = new Image();
      image.src = dataURL;

      image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
          sendFile(dataURItoBlob(dataURL, fileType), fileName);
          return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');
        context.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas.toDataURL(fileType);
        sendFile(dataURItoBlob(dataURL, fileType), fileName);
      };

      image.onerror = function () {
        alert('There was an error processing your file!');
      }
    }

    /**
     * send file
     *
     * @param fileData
     */
    function sendFile(fileData, fileName, cb) {
      var formData = new FormData();
      formData.append('file', fileData, fileName);

      $.ajax({
        type: 'POST',
        url: '/upload_image',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
          data = JSON.parse(data);
          if (data['link']) {
            editor.image.insert(data.link, true);
            cb && cb(true);
          } else {
            cb && cb(false);
          }
        },
        error: function (data) {
          cb && cb(false);
        }
      });
    }

    /**
     * select file
     * @param input
     */
    function selectFile(input) {
      if (window.File && window.FileReader && window.FormData) {
        input.on('change', function (e) {
          var self = this;
          e.preventDefault();
          e.stopPropagation();
          var file = e.target.files[0];
          if (file) {
            if (/^image\//i.test(file.type)) {
              if (isCanvasSupported()) {
                readFile(file);
              } else {
                sendFile(file, function (success) {
                  if (success) {
                    $(self).val('');
                  } else {
                    console.log('upload fail');
                  }
                });
              }
            } else {
              alert('Not a valid image!');
            }
          }
        });
      } else {
        alert("File upload is not supported!");
      }
    }

    // The start point for your plugin.
    function _init() {
      // You can access any option from documentation or your custom options.

      var $input = $('<input type="file" id="image-custom-file-input" style="width: 0;height: 0;"> accept="image/jpeg, image/jpg, image/png, image/gif, image/svg+xml"');
      $("body").append($input);

      setTimeout(function () {
        selectFile($input);
      }, 0);
    }

    function select() {
      $('#image-custom-file-input').click();
    }

    // Expose public methods. If _init is not public then the plugin won't be initialized.
    // Public method can be accessed through the editor API:
    // $('.selector').froalaEditor('myPlugin.publicMethod');
    return {
      _init: _init,
      select: select
    }
  };

  $.FroalaEditor.DefineIcon('image-custom', {NAME: 'image'});
  $.FroalaEditor.RegisterCommand('image-custom', {
    title: 'image custom',
    focus: true,
    undo: true,
    callback: function () {
      this.imageCustom.select();
    }
  });
})(jQuery);
