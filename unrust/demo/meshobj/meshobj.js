"use strict";

if( typeof Rust === "undefined" ) {
    var Rust = {};
}

(function( root, factory ) {
    if( typeof define === "function" && define.amd ) {
        define( [], factory );
    } else if( typeof module === "object" && module.exports ) {
        module.exports = factory();
    } else {
        Rust.meshobj = factory();
    }
}( this, function() {
    function __initialize( __wasm_module, __load_asynchronously ) {
    const Module = {};

    Module.STDWEB_PRIVATE = {};

// This is based on code from Emscripten's preamble.js.
Module.STDWEB_PRIVATE.to_utf8 = function to_utf8( str, addr ) {
    for( var i = 0; i < str.length; ++i ) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt( i ); // possibly a lead surrogate
        if( u >= 0xD800 && u <= 0xDFFF ) {
            u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt( ++i ) & 0x3FF);
        }

        if( u <= 0x7F ) {
            HEAPU8[ addr++ ] = u;
        } else if( u <= 0x7FF ) {
            HEAPU8[ addr++ ] = 0xC0 | (u >> 6);
            HEAPU8[ addr++ ] = 0x80 | (u & 63);
        } else if( u <= 0xFFFF ) {
            HEAPU8[ addr++ ] = 0xE0 | (u >> 12);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);
            HEAPU8[ addr++ ] = 0x80 | (u & 63);
        } else if( u <= 0x1FFFFF ) {
            HEAPU8[ addr++ ] = 0xF0 | (u >> 18);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);
            HEAPU8[ addr++ ] = 0x80 | (u & 63);
        } else if( u <= 0x3FFFFFF ) {
            HEAPU8[ addr++ ] = 0xF8 | (u >> 24);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 18) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);
            HEAPU8[ addr++ ] = 0x80 | (u & 63);
        } else {
            HEAPU8[ addr++ ] = 0xFC | (u >> 30);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 24) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 18) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);
            HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);
            HEAPU8[ addr++ ] = 0x80 | (u & 63);
        }
    }
};

Module.STDWEB_PRIVATE.noop = function() {};
Module.STDWEB_PRIVATE.to_js = function to_js( address ) {
    var kind = HEAPU8[ address + 12 ];
    if( kind === 0 ) {
        return undefined;
    } else if( kind === 1 ) {
        return null;
    } else if( kind === 2 ) {
        return HEAP32[ address / 4 ];
    } else if( kind === 3 ) {
        return HEAPF64[ address / 8 ];
    } else if( kind === 4 ) {
        var pointer = HEAPU32[ address / 4 ];
        var length = HEAPU32[ (address + 4) / 4 ];
        return Module.STDWEB_PRIVATE.to_js_string( pointer, length );
    } else if( kind === 5 ) {
        return false;
    } else if( kind === 6 ) {
        return true;
    } else if( kind === 7 ) {
        var pointer = HEAPU32[ address / 4 ];
        var length = HEAPU32[ (address + 4) / 4 ];
        var output = [];
        for( var i = 0; i < length; ++i ) {
            output.push( Module.STDWEB_PRIVATE.to_js( pointer + i * 16 ) );
        }
        return output;
    } else if( kind === 8 ) {
        var value_array_pointer = HEAPU32[ address / 4 ];
        var length = HEAPU32[ (address + 4) / 4 ];
        var key_array_pointer = HEAPU32[ (address + 8) / 4 ];
        var output = {};
        for( var i = 0; i < length; ++i ) {
            var key_pointer = HEAPU32[ (key_array_pointer + i * 8) / 4 ];
            var key_length = HEAPU32[ (key_array_pointer + 4 + i * 8) / 4 ];
            var key = Module.STDWEB_PRIVATE.to_js_string( key_pointer, key_length );
            var value = Module.STDWEB_PRIVATE.to_js( value_array_pointer + i * 16 );
            output[ key ] = value;
        }
        return output;
    } else if( kind === 9 ) {
        return Module.STDWEB_PRIVATE.acquire_js_reference( HEAP32[ address / 4 ] );
    } else if( kind === 10 ) {
        var adapter_pointer = HEAPU32[ address / 4 ];
        var pointer = HEAPU32[ (address + 4) / 4 ];
        var deallocator_pointer = HEAPU32[ (address + 8) / 4 ];
        var output = function() {
            if( pointer === 0 ) {
                throw new ReferenceError( "Already dropped Rust function called!" );
            }

            var args = Module.STDWEB_PRIVATE.alloc( 16 );
            Module.STDWEB_PRIVATE.serialize_array( args, arguments );
            Module.STDWEB_PRIVATE.dyncall( "vii", adapter_pointer, [pointer, args] );
            var result = Module.STDWEB_PRIVATE.tmp;
            Module.STDWEB_PRIVATE.tmp = null;

            return result;
        };

        output.drop = function() {
            output.drop = Module.STDWEB_PRIVATE.noop;
            var function_pointer = pointer;
            pointer = 0;

            Module.STDWEB_PRIVATE.dyncall( "vi", deallocator_pointer, [function_pointer] );
        };

        return output;
    } else if( kind === 13 ) {
        var adapter_pointer = HEAPU32[ address / 4 ];
        var pointer = HEAPU32[ (address + 4) / 4 ];
        var deallocator_pointer = HEAPU32[ (address + 8) / 4 ];
        var output = function() {
            if( pointer === 0 ) {
                throw new ReferenceError( "Already called or dropped FnOnce function called!" );
            }

            output.drop = Module.STDWEB_PRIVATE.noop;
            var function_pointer = pointer;
            pointer = 0;

            var args = Module.STDWEB_PRIVATE.alloc( 16 );
            Module.STDWEB_PRIVATE.serialize_array( args, arguments );
            Module.STDWEB_PRIVATE.dyncall( "vii", adapter_pointer, [function_pointer, args] );
            var result = Module.STDWEB_PRIVATE.tmp;
            Module.STDWEB_PRIVATE.tmp = null;

            return result;
        };

        output.drop = function() {
            output.drop = Module.STDWEB_PRIVATE.noop;
            var function_pointer = pointer;
            pointer = 0;

            Module.STDWEB_PRIVATE.dyncall( "vi", deallocator_pointer, [function_pointer] );
        };

        return output;
    } else if( kind === 14 ) {
        var pointer = HEAPU32[ address / 4 ];
        var length = HEAPU32[ (address + 4) / 4 ];
        var array_kind = HEAPU32[ (address + 8) / 4 ];
        var pointer_end = pointer + length;

        switch( array_kind ) {
            case 0:
                return HEAPU8.subarray( pointer, pointer_end );
            case 1:
                return HEAP8.subarray( pointer, pointer_end );
            case 2:
                return HEAPU16.subarray( pointer, pointer_end );
            case 3:
                return HEAP16.subarray( pointer, pointer_end );
            case 4:
                return HEAPU32.subarray( pointer, pointer_end );
            case 5:
                return HEAP32.subarray( pointer, pointer_end );
            case 6:
                return HEAPF32.subarray( pointer, pointer_end );
            case 7:
                return HEAPF64.subarray( pointer, pointer_end );
        }
    } else if( kind === 15 ) {
        return Module.STDWEB_PRIVATE.get_raw_value( HEAPU32[ address / 4 ] );
    }
};

Module.STDWEB_PRIVATE.serialize_object = function serialize_object( address, value ) {
    var keys = Object.keys( value );
    var length = keys.length;
    var key_array_pointer = Module.STDWEB_PRIVATE.alloc( length * 8 );
    var value_array_pointer = Module.STDWEB_PRIVATE.alloc( length * 16 );
    HEAPU8[ address + 12 ] = 8;
    HEAPU32[ address / 4 ] = value_array_pointer;
    HEAPU32[ (address + 4) / 4 ] = length;
    HEAPU32[ (address + 8) / 4 ] = key_array_pointer;
    for( var i = 0; i < length; ++i ) {
        var key = keys[ i ];
        var key_length = Module.STDWEB_PRIVATE.utf8_len( key );
        var key_pointer = Module.STDWEB_PRIVATE.alloc( key_length );
        Module.STDWEB_PRIVATE.to_utf8( key, key_pointer );

        var key_address = key_array_pointer + i * 8;
        HEAPU32[ key_address / 4 ] = key_pointer;
        HEAPU32[ (key_address + 4) / 4 ] = key_length;

        Module.STDWEB_PRIVATE.from_js( value_array_pointer + i * 16, value[ key ] );
    }
};

Module.STDWEB_PRIVATE.serialize_array = function serialize_array( address, value ) {
    var length = value.length;
    var pointer = Module.STDWEB_PRIVATE.alloc( length * 16 );
    HEAPU8[ address + 12 ] = 7;
    HEAPU32[ address / 4 ] = pointer;
    HEAPU32[ (address + 4) / 4 ] = length;
    for( var i = 0; i < length; ++i ) {
        Module.STDWEB_PRIVATE.from_js( pointer + i * 16, value[ i ] );
    }
};

Module.STDWEB_PRIVATE.from_js = function from_js( address, value ) {
    var kind = Object.prototype.toString.call( value );
    if( kind === "[object String]" ) {
        var length = Module.STDWEB_PRIVATE.utf8_len( value );
        var pointer = 0;
        if( length > 0 ) {
            pointer = Module.STDWEB_PRIVATE.alloc( length );
            Module.STDWEB_PRIVATE.to_utf8( value, pointer );
        }
        HEAPU8[ address + 12 ] = 4;
        HEAPU32[ address / 4 ] = pointer;
        HEAPU32[ (address + 4) / 4 ] = length;
    } else if( kind === "[object Number]" ) {
        if( value === (value|0) ) {
            HEAPU8[ address + 12 ] = 2;
            HEAP32[ address / 4 ] = value;
        } else {
            HEAPU8[ address + 12 ] = 3;
            HEAPF64[ address / 8 ] = value;
        }
    } else if( value === null ) {
        HEAPU8[ address + 12 ] = 1;
    } else if( value === undefined ) {
        HEAPU8[ address + 12 ] = 0;
    } else if( value === false ) {
        HEAPU8[ address + 12 ] = 5;
    } else if( value === true ) {
        HEAPU8[ address + 12 ] = 6;
    } else if( kind === "[object Symbol]" ) {
        var id = Module.STDWEB_PRIVATE.register_raw_value( value );
        HEAPU8[ address + 12 ] = 15;
        HEAP32[ address / 4 ] = id;
    } else {
        var refid = Module.STDWEB_PRIVATE.acquire_rust_reference( value );
        HEAPU8[ address + 12 ] = 9;
        HEAP32[ address / 4 ] = refid;
    }
};

// This is ported from Rust's stdlib; it's faster than
// the string conversion from Emscripten.
Module.STDWEB_PRIVATE.to_js_string = function to_js_string( index, length ) {
    index = index|0;
    length = length|0;
    var end = (index|0) + (length|0);
    var output = "";
    while( index < end ) {
        var x = HEAPU8[ index++ ];
        if( x < 128 ) {
            output += String.fromCharCode( x );
            continue;
        }
        var init = (x & (0x7F >> 2));
        var y = 0;
        if( index < end ) {
            y = HEAPU8[ index++ ];
        }
        var ch = (init << 6) | (y & 63);
        if( x >= 0xE0 ) {
            var z = 0;
            if( index < end ) {
                z = HEAPU8[ index++ ];
            }
            var y_z = ((y & 63) << 6) | (z & 63);
            ch = init << 12 | y_z;
            if( x >= 0xF0 ) {
                var w = 0;
                if( index < end ) {
                    w = HEAPU8[ index++ ];
                }
                ch = (init & 7) << 18 | ((y_z << 6) | (w & 63));

                output += String.fromCharCode( 0xD7C0 + (ch >> 10) );
                ch = 0xDC00 + (ch & 0x3FF);
            }
        }
        output += String.fromCharCode( ch );
        continue;
    }
    return output;
};

Module.STDWEB_PRIVATE.id_to_ref_map = {};
Module.STDWEB_PRIVATE.id_to_refcount_map = {};
Module.STDWEB_PRIVATE.ref_to_id_map = new WeakMap();
Module.STDWEB_PRIVATE.last_refid = 1;

Module.STDWEB_PRIVATE.id_to_raw_value_map = {};
Module.STDWEB_PRIVATE.last_raw_value_id = 1;

Module.STDWEB_PRIVATE.acquire_rust_reference = function( reference ) {
    if( reference === undefined || reference === null ) {
        return 0;
    }

    var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;
    var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
    var ref_to_id_map = Module.STDWEB_PRIVATE.ref_to_id_map;

    var refid = ref_to_id_map.get( reference );
    if( refid === undefined ) {
        refid = Module.STDWEB_PRIVATE.last_refid++;
        ref_to_id_map.set( reference, refid );
    }

    if( refid in id_to_ref_map ) {
        id_to_refcount_map[ refid ]++;
    } else {
        id_to_ref_map[ refid ] = reference;
        id_to_refcount_map[ refid ] = 1;
    }

    return refid;
};

Module.STDWEB_PRIVATE.acquire_js_reference = function( refid ) {
    return Module.STDWEB_PRIVATE.id_to_ref_map[ refid ];
};

Module.STDWEB_PRIVATE.increment_refcount = function( refid ) {
    Module.STDWEB_PRIVATE.id_to_refcount_map[ refid ]++;
};

Module.STDWEB_PRIVATE.decrement_refcount = function( refid ) {
    var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;
    var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
    id_to_refcount_map[ refid ]--;
    if( id_to_refcount_map[ refid ] === 0 ) {
        var reference = id_to_ref_map[ refid ];
        delete id_to_ref_map[ refid ];
        delete id_to_refcount_map[ refid ];
    }
};

Module.STDWEB_PRIVATE.register_raw_value = function( value ) {
    var id = Module.STDWEB_PRIVATE.last_raw_value_id++;
    Module.STDWEB_PRIVATE.id_to_raw_value_map[ id ] = value;
    return id;
};

Module.STDWEB_PRIVATE.unregister_raw_value = function( id ) {
    delete Module.STDWEB_PRIVATE.id_to_raw_value_map[ id ];
};

Module.STDWEB_PRIVATE.get_raw_value = function( id ) {
    return Module.STDWEB_PRIVATE.id_to_raw_value_map[ id ];
};

Module.STDWEB_PRIVATE.alloc = function alloc( size ) {
    return Module.web_malloc( size );
};

Module.STDWEB_PRIVATE.dyncall = function( signature, ptr, args ) {
    return Module.web_table.get( ptr ).apply( null, args );
};

// This is based on code from Emscripten's preamble.js.
Module.STDWEB_PRIVATE.utf8_len = function utf8_len( str ) {
    let len = 0;
    for( let i = 0; i < str.length; ++i ) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        let u = str.charCodeAt( i ); // possibly a lead surrogate
        if( u >= 0xD800 && u <= 0xDFFF ) {
            u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt( ++i ) & 0x3FF);
        }

        if( u <= 0x7F ) {
            ++len;
        } else if( u <= 0x7FF ) {
            len += 2;
        } else if( u <= 0xFFFF ) {
            len += 3;
        } else if( u <= 0x1FFFFF ) {
            len += 4;
        } else if( u <= 0x3FFFFFF ) {
            len += 5;
        } else {
            len += 6;
        }
    }
    return len;
};

Module.STDWEB_PRIVATE.prepare_any_arg = function( value ) {
    var arg = Module.STDWEB_PRIVATE.alloc( 16 );
    Module.STDWEB_PRIVATE.from_js( arg, value );
    return arg;
};

Module.STDWEB_PRIVATE.acquire_tmp = function( dummy ) {
    var value = Module.STDWEB_PRIVATE.tmp;
    Module.STDWEB_PRIVATE.tmp = null;
    return value;
};



    let HEAP8 = null;
    let HEAP16 = null;
    let HEAP32 = null;
    let HEAPU8 = null;
    let HEAPU16 = null;
    let HEAPU32 = null;
    let HEAPF32 = null;
    let HEAPF64 = null;

    Object.defineProperty( Module, 'exports', { value: {} } );

    const __imports = {
        env: {
            "__extjs_f974269cee185fcf4ae7ffa31c1aa9e6bbf5a33d": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); return Module.gl.add (ctx.createTexture ());})());
            },
            "__extjs_d69be7afc3aa1e462c4d2c4ce3646a7a8e54201d": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). offsetWidth ;})());
            },
            "__extjs_97371cbe206774b658a60ed2b24360570159c5e0": function($0, $1, $2, $3, $4, $5) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);var p = [($0), ($1), ($2), ($3)]; var ctx = Module.gl.get (($4)); var loc = Module.gl.get (($5)); ctx.uniform4f (loc , p [0], p [1], p [2], p [3])
            },
            "__extjs_e2ff1737057da17029753c46880c43c9d757ade3": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var oReq = new XMLHttpRequest (); var filename = ($1); oReq.open ("GET" , filename , true); oReq.responseType = "arraybuffer" ; var on_error_js = function (s){var on_error = ($2); on_error (s); on_error.drop ();}; oReq.onload = function (oEvent){var status = oReq.status ; var arrayBuffer = oReq.response ; if (status == 200 && arrayBuffer){var on_get_buffer = ($3); on_get_buffer (new Uint8Array (arrayBuffer)); on_get_buffer.drop ();}else {on_error_js ("Fail to get array buffer from network..");}}; oReq.onerror = function (oEvent){on_error_js ("Fail to read from network..");}; oReq.send (null);})());
            },
            "__extjs_db8a54867ee3fcd49536d584885f140a6dd85746": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.depthMask (($1));
            },
            "__extjs_e9772bc9a27da87787cd83195edb9d8369070f86": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);Module.STDWEB_PRIVATE.from_js($0, (function(){var p = ($1). concat (($2)); var ctx = Module.gl.get (($3)); ctx.texImage2D (p [0], p [1], p [2], p [3], p [4], 0 , p [2], p [6], ($4));})());
            },
            "__extjs_308378b7e769153240a5729ed6f8f95f43a4c1bd": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){return window.devicePixelRatio ;})());
            },
            "__extjs_dafc7a42f11dfd59d938a8bf392d728f25dc1191": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). clientX ;})());
            },
            "__extjs_80d6d56760c65e49b7be8b6b01c1ea861b046bf0": function($0) {
                Module.STDWEB_PRIVATE.decrement_refcount( $0 );
            },
            "__extjs_9f22d4ca7bc938409787341b7db181f8dd41e6df": function($0) {
                Module.STDWEB_PRIVATE.increment_refcount( $0 );
            },
            "__extjs_ccf5bdc80061b3ab6fc2abc02472de85b67029ee": function($0, $1, $2, $3, $4, $5, $6) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);$6 = Module.STDWEB_PRIVATE.to_js($6);var ctx = Module.gl.get (($0)); ctx.vertexAttribPointer (($1), ($2), ($3), ($4), ($5), ($6));
            },
            "__extjs_631b99b439cb07e859896f2d9c69cc8d5d33f98e": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). ctrlKey ;})());
            },
            "__extjs_a9690eca8167fa642f6ae51cc514c5ed4615725d": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); (ctx.getExtension ("WEBGL_compressed_texture_s3tc")|| ctx.getExtension ("MOZ_WEBGL_compressed_texture_s3tc")|| ctx.getExtension ("WEBKIT_WEBGL_compressed_texture_s3tc")); var p = ($2); ctx.compressedTexImage2D (p [0], p [1], ($3), p [2], p [3], 0 , ($4)); return 0 ;})());
            },
            "__extjs_dee8a279595b0cffb10dd2a0f17ab25fe348870e": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.blendFunc (($2), ($3))})());
            },
            "__extjs_24c85f09ade4ba0c087e23df37e2aa4f80edcc7f": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var gl = (($1)). getContext ("webgl2" , {alpha : false}); var version = 2 ; if (! gl){gl = (($2)). getContext ("webgl" , {alpha : false}); version = 1 ;}var ext = gl.getExtension ("WEBGL_depth_texture"); if (! Module.gl){Module.gl = {}; Module.gl.counter = 1 ; Module.gl.version = version ; Module.gl.matrix4x4 = new Float32Array ([1.0 , 0 , 0 , 0 , 0 , 1.0 , 0.0 , 0 , 0 , 0 , 1.0 , 0 , 0 , 0 , 0 , 1.0]); Module.gl.pool = {}; Module.gl.get = function (id){return Module.gl.pool [id];}; Module.gl.add = function (o){var c = Module.gl.counter ; Module.gl.pool [c]= o ; Module.gl.counter += 1 ; return c ;}; Module.gl.remove = function (id){delete Module.gl.pool [id]; return c ;}; console.log ("opengl " + gl.getParameter (gl.VERSION)); console.log ("shading language " + gl.getParameter (gl.SHADING_LANGUAGE_VERSION)); console.log ("vendor " + gl.getParameter (gl.VENDOR));}return Module.gl.add (gl);})());
            },
            "__extjs_ff5103e6cc179d13b4c7a785bdce2708fd559fc0": function($0) {
                Module.STDWEB_PRIVATE.tmp = Module.STDWEB_PRIVATE.to_js( $0 );
            },
            "__extjs_86edd83003c8f6f2c5d8d1e7aac980d8ac187810": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){window.pads = []; if (navigator.getGamepads ===undefined){console.log ("warning : no gamepad support on this browser");}else {window.addEventListener ("gamepadconnected" , function (e){if (e.gamepad){console.log ("gamepad[" + e.gamepad.index + "] id " + e.gamepad.id + " connected."); window.pads [e.gamepad.index]= e.gamepad ;}}); window.addEventListener ("gamepaddisconnected" , function (e){if (e.gamepad){console.log ("gamepad[" + e.gamepad.index + "] id " + e.gamepad.id + " disconnected."); window.pads [e.gamepad.index]= undefined ;}});}})());
            },
            "__extjs_4cc2b2ed53586a2bd32ca2206724307e82bb32ff": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);($0). appendChild (($1));
            },
            "__extjs_7c5535365a3df6a4cc1f59c4a957bfce1dbfb8ee": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var listener = ($1); ($2). addEventListener (($3), listener); return listener ;})());
            },
            "__extjs_463bc5792e63817fe63e7ddf14e5d85b7f453e7c": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.cullFace (($1));
            },
            "__extjs_1209e37f61f5ae917e01824be99d6ce77b3df8cf": function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);$6 = Module.STDWEB_PRIVATE.to_js($6);$7 = Module.STDWEB_PRIVATE.to_js($7);$8 = Module.STDWEB_PRIVATE.to_js($8);$9 = Module.STDWEB_PRIVATE.to_js($9);$10 = Module.STDWEB_PRIVATE.to_js($10);Module.STDWEB_PRIVATE.from_js($0, (function(){var buffer = ($1). createBuffer (2 , ($2), ($3). sampleRate); var channel0 = buffer.getChannelData (0); var channel1 = buffer.getChannelData (1); var obuf = ($4); for (var i = 0 , j = 0 ; i < ($5); i ++){channel0 [i]= obuf [j ++]; channel1 [i]= obuf [j ++];}var bufferSource = ($6). createBufferSource (); bufferSource.buffer = buffer ; bufferSource.connect (($7). destination); bufferSource.start (($8)); var bufferSec = ($9)/ ($10). sampleRate ; return bufferSec ;})());
            },
            "__extjs_87743027bf69198110aa547bd36a1f73a8110da8": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); if (ctx.createVertexArray){return Module.gl.add (ctx.createVertexArray ());}else {return 0 ;}})());
            },
            "__extjs_4a6b093e4442f8c931359be2fa36c108db557fc5": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). currentTime ;})());
            },
            "__extjs_1f15c5f94d189613289ce678447afdb6864d480d": function($0, $1, $2, $3, $4, $5, $6) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);$6 = Module.STDWEB_PRIVATE.to_js($6);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var tex = Module.gl.get (($2)); ctx.framebufferTexture2D (($3), ($4), ($5), tex , ($6));})());
            },
            "__extjs_72fc447820458c720c68d0d8e078ede631edd723": function($0, $1, $2) {
                console.error( 'Panic location:', Module.STDWEB_PRIVATE.to_js_string( $0, $1 ) + ':' + $2 );
            },
            "__extjs_b140767f6be6a4f2cccfcb584d9462d0be5b131c": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){($1). style.cursor = "none" ;})());
            },
            "__extjs_27aedac49688841ef596dd18b237820829c1903d": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.bindTexture (($2), null)})());
            },
            "__extjs_a8e1d9cfe0b41d7d61b849811ad1cfba32de989b": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). createElement (($2));})());
            },
            "__extjs_f509a528994574fa2297eff5d48d8f810282ef09": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.disable (($1));
            },
            "__extjs_c3364d01aed3d93dffa3b17f0fc55017ade0d063": function($0, $1, $2) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);var ctx = Module.gl.get (($0)); var loc = Module.gl.get (($1)); ctx.uniform1f (loc , ($2));
            },
            "__extjs_7ad1b6d74ad09161e54cc3395928efc20ff7acaf": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). key ;})());
            },
            "__extjs_4e89aff00c1126c510f338b695a5a0517d8753c5": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). shiftKey ;})());
            },
            "__extjs_66dbaed00cd03d9e6e351510d1d770c75c604d9c": function($0, $1, $2, $3) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);var ctx = Module.gl.get (($0)); ctx.bufferData (($1), ($2), ($3))
            },
            "__extjs_b8dd0e5968b36dc13ce7a786da49a5e2287e49b8": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.enable (($1));
            },
            "__extjs_15ed99f45d4e863c93e132c2ec04856621ce5951": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). sampleRate ;})());
            },
            "__extjs_222259c990929a8deb9fdc65c930c6a1a17de092": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var shader = Module.gl.get (($2)); ctx.compileShader (shader); var compiled = ctx.getShaderParameter (shader , 0x8B81); if (! compiled){console.log ("ERROR in shader compilation:"); console.log (ctx.getShaderInfoLog (shader));}})());
            },
            "__extjs_fcc7930b2342b1087a7fbfd518ff76eac9ef5718": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.clearDepth (($1));
            },
            "__extjs_4c936812c1ba2537b57093a5140e1553dd89b6a4": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var tex = Module.gl.get (($2)); ctx.bindTexture (($3), tex)})());
            },
            "__extjs_e6890a1cce2104cbe0b29d801480fff8ab44e962": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). altKey ;})());
            },
            "__extjs_6ce693459878698d92d56b499a1b2a5f6bb03b69": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof KeyboardEvent) | 0;
            },
            "__extjs_1814dbd23423de8fef48b8702392280db97bccf3": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); var r = ctx.getAttribLocation (h.prog , ($3)); return r >= 0 ? r : null ;})());
            },
            "__extjs_d220ae70d3a0134672f453b7b2651d9c11f72dbf": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){console.log (($1))})());
            },
            "__extjs_96338b59f1fb8075e094b9b9d6d426a9b0bcde0e": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); ctx.linkProgram (h.prog); var result = ctx.getProgramParameter (h.prog , ctx.LINK_STATUS); if (! result){console.log ("ERROR while linking program :"); console.log (ctx.getProgramInfoLog (h.prog));}})());
            },
            "__extjs_2f33107ff8cc02d70bb611c3ab61d4b0f0ca5848": function($0, $1) {
                return Module.STDWEB_PRIVATE.acquire_rust_reference( HEAPU8.slice( $0, $1 ) );
            },
            "__extjs_ec2db3548648ab60ac1583c3eadcd747bbc57199": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); var shader = Module.gl.get (($3)); ctx.attachShader (h.prog , shader)})());
            },
            "__extjs_be46082601410ad79cc753a1f76169475e7c6f74": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var callback = ($1); var request = ($2). requestAnimationFrame (callback); return {request : request , callback : callback , window : ($3)};})());
            },
            "__extjs_6f1ee42e03c014ce951f3d7be06d804c1cda8e27": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.activeTexture (ctx.TEXTURE0 + ($2))})());
            },
            "__extjs_d066f5f7c376dbd3b9d7a5020517355f5f763620": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); return Module.gl.add (ctx.createFramebuffer ());})());
            },
            "__extjs_c47de5a40be28dc0e09993c4ef100a00e4047609": function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);$6 = Module.STDWEB_PRIVATE.to_js($6);$7 = Module.STDWEB_PRIVATE.to_js($7);$8 = Module.STDWEB_PRIVATE.to_js($8);$9 = Module.STDWEB_PRIVATE.to_js($9);Module.STDWEB_PRIVATE.from_js($0, (function(){var realToCSSPixels = window.devicePixelRatio ; (($1)). width = ($2)* realToCSSPixels ; (($3)). height = ($4)* realToCSSPixels ; (($5)). style.width = ($6)+ "px" ; (($7)). style.height = ($8)+ "px" ; ($9). tabIndex = 1 ;})());
            },
            "__extjs_461c4ddc0a89e26a77ad6e90e4f35ecd98a78a8b": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); return ctx.texParameteri (($2), ($3), ($4))})());
            },
            "__extjs_8db5b8b55ad571930f6911b9ee08c3839db9d184": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var fb = Module.gl.get (($2)); ctx.bindFramebuffer (($3), fb);})());
            },
            "__extjs_d58b71739ad02dfa3c9b2672a881e9ebb741215e": function($0) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);var ctx = Module.gl.get (($0)); ctx.generateMipmap (ctx.TEXTURE_2D);
            },
            "__extjs_e72c0fa59b4192eaa92dc61cdc746eab194f8d89": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). clientY ;})());
            },
            "__extjs_a97a27fe303b22c36ccf502dc8b1d7fd24103cc4": function($0) {
                var ctx = Module.gl.get (($0)); return Module.gl.add (ctx.createBuffer ());
            },
            "__extjs_727e874dc6f121f541954f17b72fb212974ab494": function($0, $1, $2, $3, $4) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);var p = [($0), ($1), ($2)]; var ctx = Module.gl.get (($3)); var loc = Module.gl.get (($4)); ctx.uniform3f (loc , p [0], p [1], p [2])
            },
            "__extjs_830115314db84ab9de207def631da76a7bd79ece": function($0, $1, $2, $3) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);var p = [($0), ($1)]; var ctx = Module.gl.get (($2)); var loc = Module.gl.get (($3)); ctx.uniform2f (loc , p [0], p [1])
            },
            "__extjs_93b9872dc3d816765ab0e68585457a4b8d33560b": function($0) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);Promise.resolve (). then (function (){($0)();});
            },
            "__extjs_496ebd7b1bc0e6eebd7206e8bee7671ea3b8006f": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). querySelector (($2));})());
            },
            "__extjs_770a506aaacc3fea9f0be51ad402c54e7df4d528": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). button ;})());
            },
            "__extjs_09ed44a554b73eb28fb33ee7201e63333044e48c": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); return Module.gl.add (ctx.createShader (($2)));})());
            },
            "__extjs_db0226ae1bbecd407e9880ee28ddc70fc3322d9c": function($0) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);Module.STDWEB_PRIVATE.unregister_raw_value (($0));
            },
            "__extjs_d8c512882177a566be040a9c458083152ca06616": function($0, $1, $2, $3, $4, $5) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);$5 = Module.STDWEB_PRIVATE.to_js($5);Module.STDWEB_PRIVATE.from_js($0, (function(){var p = ($1). concat (($2)); var ctx = Module.gl.get (($3)); var internal_fmt = ($4); var fmt = internal_fmt ; if (($5)){internal_fmt = ctx.DEPTH_COMPONENT16 ;}ctx.texImage2D (p [0], p [1], internal_fmt , p [3], p [4], 0 , fmt , p [6], null);})());
            },
            "__extjs_cda47760902a3f6393a8196b8e630279ab7d4852": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). code ;})());
            },
            "__extjs_97495987af1720d8a9a923fa4683a7b683e3acd6": function($0, $1) {
                console.error( 'Panic error message:', Module.STDWEB_PRIVATE.to_js_string( $0, $1 ) );
            },
            "__extjs_09bde750e8a7772f139590caecca967739119638": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.bindBuffer (($1), null);
            },
            "__extjs_bfd4567841d8eb18ed384ab246d9bbf8d2ffe5b8": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = {}; h.prog = ctx.createProgram (); h.uniform_names = {}; return Module.gl.add (h);})());
            },
            "__extjs_8ec946091bb781e760245e0ae35985deddcdbb25": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof Float32Array) | 0;
            },
            "__extjs_7b630465038b02dccf64963fe95e4ba82cb49696": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){return [($1), ($2), ($3)]})());
            },
            "__extjs_69920acb495ef5b5f2a2907f2b2109c50f25a632": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof HTMLCanvasElement) | 0;
            },
            "__extjs_eaa80141e8f33256c7c62911990ccfc9238b884d": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). offsetHeight ;})());
            },
            "__extjs_84f324c7d0352dd892e579fb78f2483d03697003": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); var h = Module.gl.get (($1)); ctx.useProgram (h.prog)
            },
            "__extjs_06926d6ea4b19d04a943bb8e5eac06af2abfae0d": function($0, $1, $2) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);var ctx = Module.gl.get (($0)); var buf = Module.gl.get (($1)); ctx.bindBuffer (($2), buf)
            },
            "__extjs_dd742fd43ec5cb584d12e2b2cf147cf41128f3d1": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var array = ($0); var pointer = ($1); HEAPU8.set (array , pointer);
            },
            "__extjs_7ed1f62e776725bc93d54f5154abfb28a460024a": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof MouseEvent) | 0;
            },
            "__extjs_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf": function() {
                console.error( 'Encountered a panic!' );
            },
            "__extjs_dcbfa3eb1cc89d9842b0ad8d9030a57a7cae7124": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof Uint8Array) | 0;
            },
            "__extjs_4bdde544476d0ed67b473e13e2d502e4357a7ed4": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). getBoundingClientRect (). top ;})());
            },
            "__extjs_bd7f6e324f00cca5b26b7c6dc239a28b71e047b4": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). length ;})());
            },
            "__extjs_822794cefd39fa222ac2322af3452861a9739836": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){($1). focus ();})());
            },
            "__extjs_5ac38c9ecbb9a6f75e30e71400dabbd8d3562771": function($0) {
                return (Module.STDWEB_PRIVATE.acquire_js_reference( $0 ) instanceof Event) | 0;
            },
            "__extjs_1c8769c3b326d77ceb673ada3dc887cf1d509509": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){return document ;})());
            },
            "__extjs_45fa0fd7721cfb8ea189d5c94bfde3117b77fb88": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.enableVertexAttribArray (($1))
            },
            "__extjs_ae2c8a52ab6d1f3f05bfe3f17211ec398cd5efc4": function($0, $1) {
                return Module.STDWEB_PRIVATE.acquire_rust_reference( HEAPF32.slice( $0, $1 ) );
            },
            "__extjs_1681ea457e66a9f3c951512258a2581f67d04a83": function($0) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);($0). preventDefault ();
            },
            "__extjs_1e951cda41918338e7eb46768a59711c5daf7e19": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); if (ctx.deleteVertexArray){var vao = Module.gl.get (($1)); ctx.deleteVertexArray (vao);}
            },
            "__extjs_f3b0fb1110168017faa9af09dd1425a4d83cd7c3": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.clear (($1))
            },
            "__extjs_e073dfc1444e84226a4e1c907da91f781d787021": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); ctx.depthFunc (($1));
            },
            "__extjs_b51fe6fb4757805e82c03658195d3205bf4d45cd": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){var duration = window.endPause - window.startPause ; if (duration > 0){window.endPause = 0 ; window.startPause = 0 ; return duration ;}else if (window.startPause > 0){return - 1 ;}else {return undefined ;}})());
            },
            "__extjs_74d5764ddc102a8d3b6252116087a68f2db0c9d4": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){return window ;})());
            },
            "__extjs_c21522f7a94b7ab42d0b59c8027992d744cc9953": function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) {
                var ctx = Module.gl.get($0);
                            var loc = Module.gl.get($1);
                            var m = Module.gl.matrix4x4;
                            m[0] = $2;
                            m[1] = $3;
                            m[2] = $4;
                            m[3] = $5;
                            m[4] = $6;
                            m[5] = $7;
                            m[6] = $8;
                            m[7] = $9;
                            m[8] = $10;
                            m[9] = $11;
                            m[10] = $12;
                            m[11] = $13;
                            m[12] = $14;
                            m[13] = $15;
                            m[14] = $16;
                            m[15] = $17;
                
                            return ctx.uniformMatrix4fv(loc,false, m);
                        $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var loc = Module.gl.get (($2)); ctx.uniformMatrix3fv (loc , false , ($3))})());
            },
            "__extjs_f3904a4467cd1ca59a2e99858cd14630838460ad": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); var b = Module.gl.get (($1)); ctx.deleteBuffer (b);
            },
            "__extjs_930fe7bb2bec6f5f47e2890dabcd2100cb1c175a": function($0, $1, $2) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);var ctx = Module.gl.get (($0)); var loc = Module.gl.get (($1)); ctx.uniform1i (loc , ($2))
            },
            "__extjs_e53180c60b5a558ffebcf47c202b2fd04ba82b26": function($0, $1) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);var ctx = Module.gl.get (($0)); var p = ($1); ctx.viewport (p [0], p [1], p [2], p [3]);
            },
            "__extjs_68338eaeb693d069857b7cb2181f1f0e67f3dcbb": function($0, $1, $2, $3, $4) {
                var ctx = Module.gl.get (($0)); ctx.drawElements (($1), ($2), ($3), ($4));
            },
            "__extjs_5e0e8c7056228eabc24bab61c6d89da20d38ab62": function($0, $1) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);Module.STDWEB_PRIVATE.from_js($0, (function(){return ($1). getBoundingClientRect (). left ;})());
            },
            "__extjs_9c77862ba73701317c3eee5332aeb437ab2cb4f6": function($0, $1, $2) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);var ctx = Module.gl.get (($0)); var shader = Module.gl.get (($1)); ctx.shaderSource (shader , ($2))
            },
            "__extjs_7319cf9118022ad956782f922829278c149cd7cf": function($0, $1) {
                var ctx = Module.gl.get (($0)); if (ctx.bindVertexArray){var vao = Module.gl.get (($1)); ctx.bindVertexArray (vao);}
            },
            "__extjs_402b5f046f0f78c7cdb53a7d574de15e2c6abcb3": function($0) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);var ctx = Module.gl.get (($0)); ctx.generateMipmap (ctx.TEXTURE_CUBE_MAP);
            },
            "__extjs_d64df031b56f066447a0d56fefe70ec4035bfa7f": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){return Module.gl.version ;})());
            },
            "__extjs_48200687e94b341eb109f1769c971bac117fd46b": function($0, $1, $2, $3) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); var name = ($3); var uniform = h.uniform_names [name]; if (name in h.uniform_names)return h.uniform_names [name]; uniform = Module.gl.add (ctx.getUniformLocation (h.prog , name)); h.uniform_names [name]= uniform ; return uniform ;})());
            },
            "__extjs_bef2b05ca56bf58d10aec554f0aea9b53d4cc99f": function($0, $1, $2) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);Module.STDWEB_PRIVATE.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.bindFramebuffer (($2), null)})());
            },
            "__extjs_73f90ab5e94c84c3f2a059f535da7bbae5f7290f": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){return performance.now ()/ 1000.0 ;})());
            },
            "__extjs_ece5497f992ee18de8906377ffd034769c9f2b60": function($0, $1, $2, $3, $4) {
                $0 = Module.STDWEB_PRIVATE.to_js($0);$1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);var p = [($0), ($1), ($2), ($3)]; var ctx = Module.gl.get (($4)); ctx.clearColor (p [0], p [1], p [2], p [3]);
            },
            "__extjs_efa8f7373d7a2f19930aba239a5f1c76483e6170": function($0) {
                Module.STDWEB_PRIVATE.from_js($0, (function(){window.startPause = 0 ; window.endPause = 0 ; document.addEventListener ("visibilitychange" , (e)=> {if (document.hidden){window.startPause = performance.now ()/ 1000.0 ;}else {window.endPause = performance.now ()/ 1000.0 ;}}, false); if (AudioContext){return new AudioContext ();}else {return undefined ;}})());
            },
            "__extjs_1e69fa7bb8558bbc4b5f8f439545904d6a12f883": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB_PRIVATE.to_js($1);$2 = Module.STDWEB_PRIVATE.to_js($2);$3 = Module.STDWEB_PRIVATE.to_js($3);$4 = Module.STDWEB_PRIVATE.to_js($4);Module.STDWEB_PRIVATE.from_js($0, (function(){return [($1), ($2), ($3), ($4)]})());
            },
            "cosf": function($0) {
                return Math.cos( $0 );
            },
            "sinf": function($0) {
                return Math.sin( $0 );
            },
            "Math_tan": function($0) {
                return Math.tan( $0 );
            },
            "fmodf": function($0, $1) {
                return $0 % $1;
            },
            "expf": function($0) {
                return Math.exp( $0 );
            },
            "__web_on_grow": function() {
                const buffer = Module.instance.exports.memory.buffer;
                HEAP8 = new Int8Array( buffer );
                HEAP16 = new Int16Array( buffer );
                HEAP32 = new Int32Array( buffer );
                HEAPU8 = new Uint8Array( buffer );
                HEAPU16 = new Uint16Array( buffer );
                HEAPU32 = new Uint32Array( buffer );
                HEAPF32 = new Float32Array( buffer );
                HEAPF64 = new Float64Array( buffer );
            }
        }
    };

    function __instantiate( instance ) {
        Object.defineProperty( Module, 'instance', { value: instance } );
        Object.defineProperty( Module, 'web_malloc', { value: Module.instance.exports.__web_malloc } );
        Object.defineProperty( Module, 'web_free', { value: Module.instance.exports.__web_free } );
        Object.defineProperty( Module, 'web_table', { value: Module.instance.exports.__web_table } );

        
        __imports.env.__web_on_grow();
        Module.instance.exports.main();
    }

    if( __load_asynchronously ) {
        return WebAssembly.instantiate( __wasm_module, __imports )
            .then( instance => {
                __instantiate( instance );
                console.log( "Finished loading Rust wasm module 'meshobj'" );
                return Module.exports;
            })
            .catch( error => {
                console.log( "Error loading Rust wasm module 'meshobj':", error );
                throw error;
            });
    } else {
        const instance = new WebAssembly.Instance( __wasm_module, __imports );
        __instantiate( instance );
        return Module.exports;
    }
}


    if( typeof window === "undefined" && typeof process === "object" ) {
        const fs = require( "fs" );
        const path = require( "path" );
        const wasm_path = path.join( __dirname, "meshobj.wasm" );
        const buffer = fs.readFileSync( wasm_path );
        const mod = new WebAssembly.Module( buffer );

        return __initialize( mod, false );
    } else {
        return fetch( "meshobj.wasm" )
            .then( response => response.arrayBuffer() )
            .then( bytes => WebAssembly.compile( bytes ) )
            .then( mod => __initialize( mod, true ) );
    }
}));
