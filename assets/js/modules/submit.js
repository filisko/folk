define([
    'jquery',
    '../loader',
    '../notifier'
], function ($, loader, notifier) {
    return {
        init: function ($form) {
            var enabled = 'FormData' in window;
            var $progress = $form.next('.progress');

            $form.on('click', 'button[name="method-override"]', function () {
                enabled = false;
            });

            $form.on('submit', function (e) {
                if (!enabled) {
                    return;
                }

                e.preventDefault();

                setTimeout(function () {
                    var data = new FormData($form[0]);

                    $.ajax({
                        url: $form.attr('action'),
                        type: $form.attr('method'),
                        processData: false,
                        contentType: false,
                        data: data,
                        xhr: function () {
                            var myXhr = $.ajaxSettings.xhr();
                            var progress = $progress.show().get(0);

                            if (myXhr.upload && progress) {
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        progress.max = e.total;
                                        progress.value = e.loaded;
                                        console.log(e.loaded + ' / ' + e.total);
                                    }
                                }, false);
                            }

                            return myXhr;
                        },
                        beforeSend: function() {
                            $form.addClass('is-submiting');
                        }
                    })
                    .done(function (response) {
                        notifier.success('Data saved successfully');
                        loadContent(response);
                    })
                    .fail(function (response) {
                        if (response.text) {
                            notifier.error('Error saving data');
                            loadContent(response.text);
                        } else {
                            notifier.error('Too big data');
                            $form.removeClass('is-submiting');
                        }
                    });
                });
            });
        }
    };

    function loadContent(html) {
        var doc = document.implementation.createHTMLDocument();
        doc.documentElement.innerHTML = html;
        $('.page').html($(doc.body).find('.page').html());
        loader.init($('.page'));
    }
});