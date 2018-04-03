#!/usr/local/bin/python3

import os
import sys
import subprocess
import shutil

index_html_content = """
<!DOCTYPE html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1" name="viewport" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.min.css"
    />
    <!--[if lt IE 9]>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.ie.min.css" />
    <![endif]-->
    <script>
        // check whether this browser support webgl2
        function webgl2_support() {
            try {
                var canvas = document.createElement( 'canvas' );
                return !! window.WegGLRenderingContext && (
                    canvas.getContext('webgl2')
                );
            } catch ( e ) {
                return false;
            }
        }

        if(!webgl2_support()){
            document.addEventListener("load", function(){
                document.body.innerHTML += "Sorry, your browser do not support WebGL2."
            });
        }           
        else { 
            var Module = {};
            var __cargo_web = {};
            Object.defineProperty(Module, 'canvas', {
                get: function () {
                    if (__cargo_web.canvas) {
                        return __cargo_web.canvas;
                    }

                    var canvas = document.createElement('canvas');
                    document.querySelector('body').appendChild(canvas);
                    __cargo_web.canvas = canvas;

                    return canvas;
                }
            });
        }
    </script>

</head>

<body>
    <script src="{{JS_FILENAME}}"></script>
    <a class="github-fork-ribbon" href="https://github.com/edwin0cheng/unrust" title="Fork me on GitHub">Fork me on GitHub</a>
</body>

</html>
"""

curdir = os.path.abspath(os.path.dirname(os.path.abspath(__file__)))
unrust_path = os.path.join(curdir, "../../rust-root/unrust")

def build_example(example, *, ignore):
    build_cmd = "cargo web build --release --example " + example

    p = subprocess.run(build_cmd, cwd=unrust_path, shell=True)
    if p.returncode != 0:
        exit(1)

    src = os.path.join(unrust_path, "static")
    dest = os.path.join(curdir, "demo/" + example)
    if os.path.exists(dest) and os.path.isdir(dest):
        shutil.rmtree(dest)

    ig=shutil.ignore_patterns(*ignore)

    shutil.copytree(src, dest, ignore=ig)

    release_path = os.path.join(unrust_path, "target/wasm32-unknown-unknown/release/examples")
    src = os.path.join(release_path, example + ".js")
    shutil.copy2(src, dest)

    src = os.path.join(release_path, example + ".wasm")
    shutil.copy2(src, dest)

    with open(os.path.join(dest, "index.html"), "w") as f:
        f.write(index_html_content.replace("{{JS_FILENAME}}", example + ".js"))
 
if __name__ == "__main__":
    build_example("boxes", ignore=['sounds', 'sponza'])
    build_example("sponza", ignore=['sounds'])
    build_example("sound", ignore=['sponza'])
    build_example("postprocessing", ignore=['sounds', 'sponza'])
    build_example("meshobj", ignore=['sounds', 'sponza'])
    build_example("basic", ignore=['sounds', 'sponza'])
    