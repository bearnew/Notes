### 懒加载

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="http://apps.bdimg.com/libs/jquery/1.9.1/jquery.js
"></script>
        <title>demo lazyload</title>
        <meta charset="utf-8" />
        <style type="text/css">
            * {
                padding: 0;
                margin: 0;
                text-decoration: none;
                list-style: none;
            }
            .layout {
                margin: 0 auto;
                width: 1000px;
            }
            .lazyload img {
                width: 300px;
                height: 400px;
            }
            .img-ct {
                margin-left: -50px;
                overflow: auto;
            }
            .item {
                float: left;
                margin-left: 50px;
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="lazyload">
            <div class="layout">
                <ul class="img-ct">
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                    <li class="item">
                        <a href="javascript:void(0)"
                            ><img data-img="test.png" src=""
                        /></a>
                    </li>
                </ul>
            </div>
        </div>

        <script type="text/javascript">
            var lazyLoad = (function () {
                var clock;

                function init() {
                    $(window).on("scroll", function () {
                        if (clock) {
                            clearTimeout(clock);
                        }
                        clock = setTimeout(function () {
                            checkShow();
                        }, 200);
                    });
                    checkShow();
                }

                function checkShow() {
                    $(".lazyload img").each(function () {
                        var $cur = $(this);
                        if ($cur.attr("isLoaded")) {
                            return;
                        }
                        if (shouldShow($cur)) {
                            showImg($cur);
                        }
                    });
                }
                function shouldShow($node) {
                    var scrollH = $(window).scrollTop(),
                        winH = $(window).height(),
                        top = $node.offset().top;
                    if (top < winH + scrollH) {
                        return true;
                    } else {
                        return false;
                    }
                }
                function showImg($node) {
                    $node.attr("src", $node.attr("data-img"));
                    $node.attr("isLoaded", true);
                }
                return {
                    init: init,
                };
            })();
            lazyLoad.init();

            // 图片懒加载1
            const images = [...document.querySelectorAll(".images")];
            images.forEach((image) => {
                if (
                    image.getBoundingClientRect().top <
                    document.documentElement.clientHeight
                ) {
                    image.src = image.dataset.src;
                }
            });

            // 图片懒加载2
            const io = new IntersectionObserver((entiesList) => {
                // entiesList为所有img的组合
                entiesList.forEach(
                    (enty) => {
                        const dom = enty.target;
                        if (
                            enty.intersectionRatio > 0 &&
                            enty.intersectionRatio <= 1
                        ) {
                            // 在视口内[0, 1]
                            if (!dom.src) dom.src = dom.dataset.src;
                        }
                    },
                    {
                        threshold: [0],
                    }
                );
            });
            document
                .querySelectorAll("img")
                .forEach((item) => io.observe(item));
        </script>
    </body>
</html>
```
