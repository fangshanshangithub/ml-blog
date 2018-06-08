$(function () {
    // Waves初始化
    Waves.displayEffect();
});

// iframe高度自适应
function changeFrameHeight(ifm) {
    ifm.height = document.documentElement.clientHeight - 200;
}
function resizeFrameHeight() {
    $('.tab_iframe').css('height', document.documentElement.clientHeight - 200);
    $('md-tab-content').css('left', '0');
}
window.onresize = function() {
    resizeFrameHeight();
    initScrollShow();
    initScrollState();
}

// ========== 选项卡操作 ==========
$(function() {
    // 选项卡点击
    $(document).on('click', '.content_tab li', function() {
        // 切换选项卡
        $('.content_tab li').removeClass('cur');
        $(this).addClass('cur');
        // 切换iframe
        $('.iframe').removeClass('cur');
        $('#iframe_' + $(this).data('index')).addClass('cur');
        var marginLeft = ($('#tabs').css('marginLeft').replace('px', ''));
        // 滚动到可视区域:在左侧
        if ($(this).position().left < marginLeft) {
            var left = $('.content_tab>ul').scrollLeft() + $(this).position().left - marginLeft;
            $('.content_tab>ul').animate({scrollLeft: left}, 200, function() {
                initScrollState();
            });
        }
        // 滚动到可视区域:在右侧
        if(($(this).position().left + $(this).width() - marginLeft) > document.getElementById('tabs').clientWidth) {
            var left = $('.content_tab>ul').scrollLeft() + (($(this).position().left + $(this).width() - marginLeft) - document.getElementById('tabs').clientWidth);
            $('.content_tab>ul').animate({scrollLeft: left}, 200, function() {
                initScrollState();
            });
        }
    });
    // 控制选项卡滚动位置
    $(document).on('click', '.tab_left>a', function() {
        $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() - 300}, 200, function() {
            initScrollState();
        });
    });
    // 向右箭头
    $(document).on('click', '.tab_right>a', function() {
        $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() + 300}, 200, function() {
            initScrollState();
        });
    });
    // 初始化箭头状态

    // 选项卡右键菜单
    var menu = new BootstrapMenu('.tabs li', {
        fetchElementData: function(item) {
            return item;
        },
        actionsGroups: [
            ['close', 'refresh'],
            ['closeOther', 'closeAll'],
            ['closeRight', 'closeLeft']
        ],
        actions: {
            close: {
                name: '关闭',
                iconClass: 'md md-close',
                onClick: function(item) {
                    Tab.closeTab($(item));
                }
            },
            closeOther: {
                name: '关闭其他',
                iconClass: 'md  md-fullscreen-exit',
                onClick: function(item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function() {
                        if ($(this).data('index') != index) {
                            Tab.closeTab($(this));
                        }
                    });
                }
            },
            closeAll: {
                name: '关闭全部',
                iconClass: 'md md-cancel',
                onClick: function() {
                    $('.content_tab li').each(function() {
                        Tab.closeTab($(this));
                    });
                }
            },
            closeRight: {
                name: '关闭右侧所有',
                iconClass: 'md md-arrow-forward',
                onClick: function(item) {
                    var index = $(item).data('index');
                    $($('.content_tab li').toArray().reverse()).each(function() {
                        if ($(this).data('index') != index) {
                            Tab.closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            closeLeft: {
                name: '关闭左侧所有',
                iconClass: 'md md-arrow-back',
                onClick: function(item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function() {
                        if ($(this).data('index') != index) {
                            Tab.closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            refresh: {
                name: '刷新',
                iconClass: 'md md-refresh',
                onClick: function(item) {
                    var index = $(item).data('index');
                    var $iframe = $('#iframe_' + index).find('iframe');
                    $iframe.attr('src', $iframe.attr('src'));
                }
            }
        }
    });
});
// 选项卡对象
var Tab = {
    addTab: function(title, url,id) {
        var index = url.replace(/\./g, '_').replace(/\//g, '_').replace(/:/g, '_').replace(/\?/g, '_').replace(/,/g, '_').replace(/=/g, '_').replace(/&/g, '_');
        // 如果存在选项卡，则激活，否则创建新选项卡
        if ($('#tab_' + index).length == 0) {
            // 添加选项卡
            $('.content_tab li').removeClass('cur');
            var tab = '<li id="tab_' + index +'" data-index="' + index + '" class="cur"><a class="waves-effect waves-light">' + title + '</a></li>';//<i class="zmdi zmdi-close"></i><
            $('.content_tab>ul').append(tab);
            // 添加iframe
            $('.iframe').removeClass('cur');
            var iframe = '<div id="iframe_' + index + '" class="iframe cur"><iframe class="tab_iframe" src="' + url + '" width="100%" frameborder="0" scrolling="auto" onload="changeFrameHeight(this)"></iframe></div>';
            $('.content_main').append(iframe);
            initScrollShow();
            $('.content_tab>ul').animate({scrollLeft: document.getElementById('tabs').scrollWidth - document.getElementById('tabs').clientWidth}, 200, function() {
                initScrollState();
            });

            $("a,li").removeClass("active");
            $("#" + id).parent().addClass("active").parents("li").children().eq(0).addClass("active");

        } else {
            $('#tab_' + index).trigger('click');

            $("a,li").removeClass("active");
            $("#" + id).parent().addClass("active").parents("li").children().eq(0).addClass("active");
        }
    },
    closeTab: function($item) {
        var closeable = $item.data('closeable');
        if (closeable != false) {
            // 如果当前时激活状态则关闭后激活左边选项卡
            if($item.hasClass('cur')) {
                $item.prev().trigger('click');
            }
            // 关闭当前选项卡
            var index = $item.data('index');
            $('#iframe_' + index).remove();
            $item.remove();
        }
        initScrollShow();
    }
}

function initScrollShow() {
    if (document.getElementById('tabs').scrollWidth > document.getElementById('tabs').clientWidth) {
        $('.content_tab').addClass('scroll');
    } else {
        $('.content_tab').removeClass('scroll');
    }
}
function initScrollState() {
    if ($('.content_tab>ul').scrollLeft() == 0) {
        $('.tab_left>a').removeClass('active');
    } else {
        $('.tab_left>a').addClass('active');
    }
    if (($('.content_tab>ul').scrollLeft() + document.getElementById('tabs').clientWidth) >= document.getElementById('tabs').scrollWidth) {
        $('.tab_right>a').removeClass('active');
    } else {
        $('.tab_right>a').addClass('active');
    }
}