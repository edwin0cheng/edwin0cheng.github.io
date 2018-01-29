"use strict";

if( typeof Rust === 'undefined' ) {
    var Rust = {};
}

(function( root, factory ) {
    if( typeof define === "function" && define.amd ) {
        define( [], factory );
    } else if( typeof module === "object" && module.exports ) {
        module.exports = factory();
    } else {
        factory();
    }
}( this, function() {
    const Module = {};
    let HEAP8 = null;
    let HEAP16 = null;
    let HEAP32 = null;
    let HEAPU8 = null;
    let HEAPU16 = null;
    let HEAPU32 = null;
    let HEAPF32 = null;
    let HEAPF64 = null;

    Object.defineProperty( Module, 'nodejs', { value: (typeof window === 'undefined') } );
    Object.defineProperty( Module, 'exports', { value: {} } );

    const __imports = {
        env: {
            "__extjs_29f3d2b8491e03159662b41bcd69940925fe9451": function() {
                Module.STDWEB = {};   Module.STDWEB.to_utf8 = function to_utf8( str, addr ) {     for( var i = 0; i < str.length; ++i ) {                                    var u = str.charCodeAt( i );          if( u >= 0xD800 && u <= 0xDFFF ) {             u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt( ++i ) & 0x3FF);         }          if( u <= 0x7F ) {             HEAPU8[ addr++ ] = u;         } else if( u <= 0x7FF ) {             HEAPU8[ addr++ ] = 0xC0 | (u >> 6);             HEAPU8[ addr++ ] = 0x80 | (u & 63);         } else if( u <= 0xFFFF ) {             HEAPU8[ addr++ ] = 0xE0 | (u >> 12);             HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);             HEAPU8[ addr++ ] = 0x80 | (u & 63);         } else if( u <= 0x1FFFFF ) {             HEAPU8[ addr++ ] = 0xF0 | (u >> 18);             HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);             HEAPU8[ addr++ ] = 0x80 | (u & 63);         } else if( u <= 0x3FFFFFF ) {             HEAPU8[ addr++ ] = 0xF8 | (u >> 24);             HEAPU8[ addr++ ] = 0x80 | ((u >> 18) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);             HEAPU8[ addr++ ] = 0x80 | (u & 63);         } else {             HEAPU8[ addr++ ] = 0xFC | (u >> 30);             HEAPU8[ addr++ ] = 0x80 | ((u >> 24) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 18) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 12) & 63);             HEAPU8[ addr++ ] = 0x80 | ((u >> 6) & 63);             HEAPU8[ addr++ ] = 0x80 | (u & 63);         }     } };  Module.STDWEB.noop = function() {}; Module.STDWEB.to_js = function to_js( address ) {     var kind = HEAPU8[ address + 12 ];     if( kind === 0 ) {         return undefined;     } else if( kind === 1 ) {         return null;     } else if( kind === 2 ) {         return HEAP32[ address / 4 ];     } else if( kind === 3 ) {         return HEAPF64[ address / 8 ];     } else if( kind === 4 ) {         var pointer = HEAPU32[ address / 4 ];         var length = HEAPU32[ (address + 4) / 4 ];         return Module.STDWEB.to_js_string( pointer, length );     } else if( kind === 5 ) {         return false;     } else if( kind === 6 ) {         return true;     } else if( kind === 7 ) {         var pointer = HEAPU32[ address / 4 ];         var length = HEAPU32[ (address + 4) / 4 ];         var output = [];         for( var i = 0; i < length; ++i ) {             output.push( Module.STDWEB.to_js( pointer + i * 16 ) );         }         return output;     } else if( kind === 8 ) {         var value_array_pointer = HEAPU32[ address / 4 ];         var length = HEAPU32[ (address + 4) / 4 ];         var key_array_pointer = HEAPU32[ (address + 8) / 4 ];         var output = {};         for( var i = 0; i < length; ++i ) {             var key_pointer = HEAPU32[ (key_array_pointer + i * 8) / 4 ];             var key_length = HEAPU32[ (key_array_pointer + 4 + i * 8) / 4 ];             var key = Module.STDWEB.to_js_string( key_pointer, key_length );             var value = Module.STDWEB.to_js( value_array_pointer + i * 16 );             output[ key ] = value;         }         return output;     } else if( kind === 9 || kind === 11 || kind === 12 ) {         return Module.STDWEB.acquire_js_reference( HEAP32[ address / 4 ] );     } else if( kind === 10 ) {         var adapter_pointer = HEAPU32[ address / 4 ];         var pointer = HEAPU32[ (address + 4) / 4 ];         var deallocator_pointer = HEAPU32[ (address + 8) / 4 ];         var output = function() {             if( pointer === 0 ) {                 throw new ReferenceError( "Already dropped Rust function called!" );             }              var args = Module.STDWEB.alloc( 16 );             Module.STDWEB.serialize_array( args, arguments );             Module.STDWEB.dyncall( "vii", adapter_pointer, [pointer, args] );             var result = Module.STDWEB.tmp;             Module.STDWEB.tmp = null;              return result;         };          output.drop = function() {             output.drop = Module.STDWEB.noop;             var function_pointer = pointer;             pointer = 0;              Module.STDWEB.dyncall( "vi", deallocator_pointer, [function_pointer] );         };          return output;     } else if( kind === 13 ) {         var adapter_pointer = HEAPU32[ address / 4 ];         var pointer = HEAPU32[ (address + 4) / 4 ];         var deallocator_pointer = HEAPU32[ (address + 8) / 4 ];         var output = function() {             if( pointer === 0 ) {                 throw new ReferenceError( "Already called or dropped FnOnce function called!" );             }              output.drop = Module.STDWEB.noop;             var function_pointer = pointer;             pointer = 0;              var args = Module.STDWEB.alloc( 16 );             Module.STDWEB.serialize_array( args, arguments );             Module.STDWEB.dyncall( "vii", adapter_pointer, [function_pointer, args] );             var result = Module.STDWEB.tmp;             Module.STDWEB.tmp = null;              return result;         };          output.drop = function() {             output.drop = Module.STDWEB.noop;             var function_pointer = pointer;             pointer = 0;              Module.STDWEB.dyncall( "vi", deallocator_pointer, [function_pointer] );         };          return output;     } else if( kind === 14 ) {         var pointer = HEAPU32[ address / 4 ];         var length = HEAPU32[ (address + 4) / 4 ];         var array_kind = HEAPU32[ (address + 8) / 4 ];         var pointer_end = pointer + length;          switch( array_kind ) {             case 0:                 return HEAPU8.subarray( pointer, pointer_end );             case 1:                 return HEAP8.subarray( pointer, pointer_end );             case 2:                 return HEAPU16.subarray( pointer, pointer_end );             case 3:                 return HEAP16.subarray( pointer, pointer_end );             case 4:                 return HEAPU32.subarray( pointer, pointer_end );             case 5:                 return HEAP32.subarray( pointer, pointer_end );             case 6:                 return HEAPF32.subarray( pointer, pointer_end );             case 7:                 return HEAPF64.subarray( pointer, pointer_end );         }     } };  Module.STDWEB.serialize_object = function serialize_object( address, value ) {     var keys = Object.keys( value );     var length = keys.length;     var key_array_pointer = Module.STDWEB.alloc( length * 8 );     var value_array_pointer = Module.STDWEB.alloc( length * 16 );     HEAPU8[ address + 12 ] = 8;     HEAPU32[ address / 4 ] = value_array_pointer;     HEAPU32[ (address + 4) / 4 ] = length;     HEAPU32[ (address + 8) / 4 ] = key_array_pointer;     for( var i = 0; i < length; ++i ) {         var key = keys[ i ];         var key_length = Module.STDWEB.utf8_len( key );         var key_pointer = Module.STDWEB.alloc( key_length );         Module.STDWEB.to_utf8( key, key_pointer );          var key_address = key_array_pointer + i * 8;         HEAPU32[ key_address / 4 ] = key_pointer;         HEAPU32[ (key_address + 4) / 4 ] = key_length;          Module.STDWEB.from_js( value_array_pointer + i * 16, value[ key ] );     } };  Module.STDWEB.serialize_array = function serialize_array( address, value ) {     var length = value.length;     var pointer = Module.STDWEB.alloc( length * 16 );     HEAPU8[ address + 12 ] = 7;     HEAPU32[ address / 4 ] = pointer;     HEAPU32[ (address + 4) / 4 ] = length;     for( var i = 0; i < length; ++i ) {         Module.STDWEB.from_js( pointer + i * 16, value[ i ] );     } };  Module.STDWEB.from_js = function from_js( address, value ) {     var kind = Object.prototype.toString.call( value );     if( kind === "[object String]" ) {         var length = Module.STDWEB.utf8_len( value );         var pointer = 0;         if( length > 0 ) {             pointer = Module.STDWEB.alloc( length );             Module.STDWEB.to_utf8( value, pointer );         }         HEAPU8[ address + 12 ] = 4;         HEAPU32[ address / 4 ] = pointer;         HEAPU32[ (address + 4) / 4 ] = length;     } else if( kind === "[object Number]" ) {         if( value === (value|0) ) {             HEAPU8[ address + 12 ] = 2;             HEAP32[ address / 4 ] = value;         } else {             HEAPU8[ address + 12 ] = 3;             HEAPF64[ address / 8 ] = value;         }     } else if( value === null ) {         HEAPU8[ address + 12 ] = 1;     } else if( value === undefined ) {         HEAPU8[ address + 12 ] = 0;     } else if( value === false ) {         HEAPU8[ address + 12 ] = 5;     } else if( value === true ) {         HEAPU8[ address + 12 ] = 6;     } else {         var refid = Module.STDWEB.acquire_rust_reference( value );         var id = 9;         if( kind === "[object Object]" ) {             id = 11;         } else if( kind === "[object Array]" || kind === "[object Arguments]" ) {             id = 12;         }          HEAPU8[ address + 12 ] = id;         HEAP32[ address / 4 ] = refid;     } };    Module.STDWEB.to_js_string = function to_js_string( index, length ) {     index = index|0;     length = length|0;     var end = (index|0) + (length|0);     var output = "";     while( index < end ) {         var x = HEAPU8[ index++ ];         if( x < 128 ) {             output += String.fromCharCode( x );             continue;         }         var init = (x & (0x7F >> 2));         var y = 0;         if( index < end ) {             y = HEAPU8[ index++ ];         }         var ch = (init << 6) | (y & 63);         if( x >= 0xE0 ) {             var z = 0;             if( index < end ) {                 z = HEAPU8[ index++ ];             }             var y_z = ((y & 63) << 6) | (z & 63);             ch = init << 12 | y_z;             if( x >= 0xF0 ) {                 var w = 0;                 if( index < end ) {                     w = HEAPU8[ index++ ];                 }                 ch = (init & 7) << 18 | ((y_z << 6) | (w & 63));             }         }         output += String.fromCharCode( ch );         continue;     }     return output; };  var id_to_ref_map = {}; var id_to_refcount_map = {}; var ref_to_id_map = new WeakMap(); var ref_to_id_symbol_map = {}; var last_refid = 1;  Module.STDWEB.acquire_rust_reference = function( reference ) {     if( reference === undefined || reference === null ) {         return 0;     }      var refid = ref_to_id_map.get( reference );     if( refid === undefined ) {         refid = ref_to_id_symbol_map[ reference ];     }      if( refid === undefined ) {         refid = last_refid++;         if( typeof reference === "symbol" ) {             ref_to_id_symbol_map[ reference ] = refid;         } else {             ref_to_id_map.set( reference, refid );         }         id_to_ref_map[ refid ] = reference;         id_to_refcount_map[ refid ] = 1;     } else {         id_to_refcount_map[ refid ]++;     }      return refid; };  Module.STDWEB.acquire_js_reference = function( refid ) {     return id_to_ref_map[ refid ]; };  Module.STDWEB.increment_refcount = function( refid ) {     id_to_refcount_map[ refid ]++; };  Module.STDWEB.decrement_refcount = function( refid ) {     id_to_refcount_map[ refid ]--;     if( id_to_refcount_map[ refid ] === 0 ) {         var reference = id_to_ref_map[ refid ];         delete id_to_ref_map[ refid ];         delete id_to_refcount_map[ refid ];         if( typeof reference === "symbol" ) {             delete ref_to_id_symbol_map[ reference ];         } else {             ref_to_id_map.delete( reference );         }     } }; Module.STDWEB.alloc = function alloc( size ) {     return Module.web_malloc( size ); };  Module.STDWEB.dyncall = function( signature, ptr, args ) {     return Module.web_table.get( ptr ).apply( null, args ); };   Module.STDWEB.utf8_len = function utf8_len( str ) {     let len = 0;     for( let i = 0; i < str.length; ++i ) {                           let u = str.charCodeAt( i );          if( u >= 0xD800 && u <= 0xDFFF ) {             u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt( ++i ) & 0x3FF);         }          if( u <= 0x7F ) {             ++len;         } else if( u <= 0x7FF ) {             len += 2;         } else if( u <= 0xFFFF ) {             len += 3;         } else if( u <= 0x1FFFFF ) {             len += 4;         } else if( u <= 0x3FFFFFF ) {             len += 5;         } else {             len += 6;         }     }     return len; };
            },
            "__extjs_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf": function() {
                console.error( 'Encountered a panic!' );
            },
            "__extjs_b00b05929b445348eab177b6d3f509bcaa28782e": function($0, $1) {
                console.error( 'Panic error message:', Module.STDWEB.to_js_string( $0, $1 ) );
            },
            "__extjs_20637d8f642203b38c263a5d0f43b9d88ec67c31": function($0, $1, $2) {
                console.error( 'Panic location:', Module.STDWEB.to_js_string( $0, $1 ) + ':' + $2 );
            },
            "__extjs_de942ef9ccd064c41dc92d5b5bf83c61aeb00278": function($0) {
                Module.STDWEB.increment_refcount( $0 );
            },
            "__extjs_f0da9e3af46afb4353410c272d5cdc083a223958": function($0) {
                return (Module.STDWEB.acquire_js_reference( $0 ) instanceof Uint8Array) | 0;
            },
            "__extjs_d8a439451216bbc6cd9f3012f189d2ad6a2e9459": function($0) {
                Module.STDWEB.decrement_refcount( $0 );
            },
            "__extjs_94be576145abfa284eb52bcbf98871bcbf01d427": function($0, $1) {
                return Module.STDWEB.acquire_rust_reference( HEAPU8.slice( $0, $1 ) );
            },
            "__extjs_d12a8a2eb9b1308d78c85a774baa5ccf56165b6a": function($0) {
                Module.STDWEB.from_js($0, (function(){return document ;})());
            },
            "__extjs_008fcd530c4c00d7d2ff52fe174987cf5bb4c829": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){return ($1). querySelector (($2));})());
            },
            "__extjs_0e0435c2fbabe7db6df9fbbf664296db7d516457": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){return ($1). createElement (($2));})());
            },
            "__extjs_90f666c53502013bd389c2428faec60d7354f58e": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){return ($1). createTextNode (($2));})());
            },
            "__extjs_f7f1404c57537e9c7c0543dfadcb814c517d00fb": function($0, $1) {
                $1 = Module.STDWEB.to_js($1);Module.STDWEB.from_js($0, (function(){var callback = ($1); window.requestAnimationFrame (callback);})());
            },
            "__extjs_50cbd3119b7e04a174c88cd33e066670f47cff08": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);$4 = Module.STDWEB.to_js($4);Module.STDWEB.from_js($0, (function(){(($1)). width = ($2); ($3). height = ($4);})());
            },
            "__extjs_54f989d4d962d339471cfe7f64168fa3685c474a": function($0, $1) {
                $1 = Module.STDWEB.to_js($1);Module.STDWEB.from_js($0, (function(){var div = ($1); div.id = "caption" ; div.style.position = "fixed" ; div.style.top = "580px" ; div.style.left = "5px" ; div.style.padding = "5px" ; div.style.backgroundColor = "lightblue" ; div.style.textAlign = "center" ;})());
            },
            "__extjs_90b48540188f65d522556bd319099cef7dbcb8ca": function($0, $1) {
                $1 = Module.STDWEB.to_js($1);Module.STDWEB.from_js($0, (function(){var div = ($1); div.id = "fps" ; div.style.position = "fixed" ; div.style.top = "5px" ; div.style.left = "5px" ; div.style.padding = "5px" ; div.style.backgroundColor = "lightblue" ; div.style.textAlign = "center" ;})());
            },
            "__extjs_0163a7b9931afad462b1dba99c29c07b53e4aded": function($0) {
                Module.STDWEB.from_js($0, (function(){return performance.now ();})());
            },
            "__extjs_97d57fd0d0efc52ba1778e791bddf1ded7830419": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){($1). innerText = "fps : " + ($2)})());
            },
            "__extjs_f7a86127f849df6057502d4b3d8229979ccfa151": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);$4 = Module.STDWEB.to_js($4);Module.STDWEB.from_js($0, (function(){return [($1), ($2), ($3), ($4)]})());
            },
            "__extjs_df9b39af728ca6acc63dbc5b63397d47ae61decc": function($0, $1, $2, $3, $4) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);$4 = Module.STDWEB.to_js($4);Module.STDWEB.from_js($0, (function(){var p = ($1); var ctx = Module.gl.get (($2)); ctx.vertexAttribPointer (p [0], p [1], p [2], p [3], ($3), ($4));})());
            },
            "__extjs_29fe6c7c7b40c907878d2da089582d8729ab64ad": function($0, $1, $2, $3) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); return ctx.getAttribLocation (h.prog , ($3));})());
            },
            "__extjs_8d2de66e0db5b8a9dd0047ca7b9d54eb33f31f87": function($0, $1, $2) {
                $0 = Module.STDWEB.to_js($0);$1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);var ctx = Module.gl.get (($0)); var buf = Module.gl.get (($1)); ctx.bindBuffer (($2), buf)
            },
            "__extjs_68338eaeb693d069857b7cb2181f1f0e67f3dcbb": function($0, $1, $2, $3, $4) {
                var ctx = Module.gl.get (($0)); ctx.drawElements (($1), ($2), ($3), ($4));
            },
            "__extjs_a97a27fe303b22c36ccf502dc8b1d7fd24103cc4": function($0) {
                var ctx = Module.gl.get (($0)); return Module.gl.add (ctx.createBuffer ());
            },
            "__extjs_54afae9273ec3bcf6fa02fbaed76cf031234a134": function($0, $1) {
                $0 = Module.STDWEB.to_js($0);$1 = Module.STDWEB.to_js($1);var ctx = Module.gl.get (($0)); ctx.bindBuffer (($1), null);
            },
            "__extjs_edd690dd32984fc70dd0fb8a0c3af450c1a2c973": function($0, $1, $2, $3) {
                $0 = Module.STDWEB.to_js($0);$1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);var ctx = Module.gl.get (($0)); ctx.bufferData (($1), ($2), ($3))
            },
            "__extjs_c392c4a79eb6e4a2a2e8a4f9907a3b7f545be4b3": function($0, $1) {
                $1 = Module.STDWEB.to_js($1);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = {}; h.prog = ctx.createProgram (); h.uniform_names = {}; return Module.gl.add (h);})());
            },
            "__extjs_77eefe750c3ac50480b17b8bf59fac63bcfb6678": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); ctx.linkProgram (h.prog);})());
            },
            "__extjs_71717602ee3deca90a54cd49df78ebb11c13931a": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); ctx.useProgram (h.prog)})());
            },
            "__extjs_0088e2fb885208bbfc4a92f3ec5c1d71feadeb9d": function($0, $1) {
                $1 = Module.STDWEB.to_js($1);Module.STDWEB.from_js($0, (function(){console.log (($1))})());
            },
            "__extjs_7ca89decec0f19f700c1bb935e0aa0e8763da618": function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) {
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
            },
            "__extjs_8bf0fcdc170432d142a0ce7a09064565bf404968": function($0, $1, $2, $3) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); var name = ($3); var uniform = h.uniform_names [name]; if (name in h.uniform_names)return h.uniform_names [name]; uniform = Module.gl.add (ctx.getUniformLocation (h.prog , name)); h.uniform_names [name]= uniform ; return uniform ;})());
            },
            "__extjs_c9510c8b2b5de716a257a8423518297a418288ea": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.enableVertexAttribArray (($2))})());
            },
            "__extjs_c7ea7ccae52c2266c0ad09c06d56649b6a5ff512": function($0, $1, $2, $3) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var h = Module.gl.get (($2)); var shader = Module.gl.get (($3)); ctx.attachShader (h.prog , shader)})());
            },
            "__extjs_f4dadb3d0a324fb01fcc2a9995120d1c4982e5bf": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var shader = Module.gl.get (($2)); ctx.compileShader (shader); var compiled = ctx.getShaderParameter (shader , 0x8B81); console.log ("Shader compiled successfully:" , compiled); var compilationLog = ctx.getShaderInfoLog (shader); console.log ("Shader compiler log:" , compilationLog);})());
            },
            "__extjs_4a700ad8c71aa2793458f93d96b2344fb69c563f": function($0, $1, $2) {
                $0 = Module.STDWEB.to_js($0);$1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);var ctx = Module.gl.get (($0)); var shader = Module.gl.get (($1)); ctx.shaderSource (shader , ($2))
            },
            "__extjs_50ff2eb3161e27ba37f603cfe39c138f432c6f39": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); return Module.gl.add (ctx.createShader (($2)));})());
            },
            "__extjs_9a5ea73f271ae5794d041e24b580ae046383166c": function($0, $1, $2, $3, $4, $5) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);$4 = Module.STDWEB.to_js($4);$5 = Module.STDWEB.to_js($5);Module.STDWEB.from_js($0, (function(){var p = [($1), ($2), ($3), ($4)]; var ctx = Module.gl.get (($5)); ctx.clearColor (p [0], p [1], p [2], p [3]);})());
            },
            "__extjs_dbb3871b0de90d889736f17bfa2415b5cf2400fd": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.clear (($2))})());
            },
            "__extjs_5d3c36cc61f2f638680ddd0b0a8f5ee2481b0cf8": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var gl = (($1)). getContext (($2)); if (! Module.gl){Module.gl = {}; Module.gl.counter = 1 ; Module.gl.matrix4x4 = new Float32Array ([1.0 , 0 , 0 , 0 , 0 , 1.0 , 0.0 , 0 , 0 , 0 , 1.0 , 0 , 0 , 0 , 0 , 1.0]); Module.gl.pool = {}; Module.gl.get = function (id){return Module.gl.pool [id];}; Module.gl.add = function (o){var c = Module.gl.counter ; Module.gl.pool [c]= o ; Module.gl.counter += 1 ; return c ;}; Module.gl.remove = function (id){delete Module.gl.pool [id]; return c ;};}return Module.gl.add (gl);})());
            },
            "__extjs_eef264d50486c64e65c7f22f2babe7826f089eca": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); ctx.enable (($2))})());
            },
            "__extjs_e3e3868962bbaa7945dea914b9befdd01e2bddaa": function($0, $1, $2) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);Module.STDWEB.from_js($0, (function(){var ctx = Module.gl.get (($1)); var p = ($2); ctx.viewport (p [0], p [1], p [2], p [3]);})());
            },
            "__extjs_ff2c75b4783fd5c9d8c934bbd4a03e66527e05e4": function($0) {
                Module.STDWEB.tmp = Module.STDWEB.to_js( $0 );
            },
            "__extjs_81d99dd180b9769eb1e2b2849590216cf5c21704": function($0, $1, $2, $3) {
                $1 = Module.STDWEB.to_js($1);$2 = Module.STDWEB.to_js($2);$3 = Module.STDWEB.to_js($3);Module.STDWEB.from_js($0, (function(){var listener = ($1); ($2). addEventListener (($3), listener); return listener ;})());
            },
            "__extjs_7454d04402ec90b4dd0de9abaf2d2d650112f2e3": function($0) {
                return (Module.STDWEB.acquire_js_reference( $0 ) instanceof MouseEvent) | 0;
            },
            "__extjs_2339159f69df37bd6978051aaf3e31da270868de": function($0, $1) {
                $0 = Module.STDWEB.to_js($0);$1 = Module.STDWEB.to_js($1);($0). appendChild (($1));
            },
            "Math_acos": function($0) {
                return Math.acos( $0 );
            },
            "Math_tan": function($0) {
                return Math.tan( $0 );
            },
            "cosf": function($0) {
                return Math.cos( $0 );
            },
            "sinf": function($0) {
                return Math.sin( $0 );
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

    function __load( instance ) {
        Object.defineProperty( Module, 'instance', { value: instance } );
        Object.defineProperty( Module, 'web_malloc', { value: Module.instance.exports.__web_malloc } );
        Object.defineProperty( Module, 'web_free', { value: Module.instance.exports.__web_free } );
        Object.defineProperty( Module, 'web_table', { value: Module.instance.exports.__web_table } );

        if( typeof module !== 'undefined' && module.exports ) {
            module.exports = Module.exports;
        } else {
            Rust.unigame.exports = Module.exports;
        }

        __imports.env.__web_on_grow();
        Module.instance.exports.__web_main();
    }

    if( Module.nodejs ) {
        const fs = require( 'fs' );
        const path = require( 'path' );
        const wasm_path = path.join( __dirname, "unigame.wasm" );
        const buffer = fs.readFileSync( wasm_path );
        const mod = new WebAssembly.Module( buffer );
        const instance = new WebAssembly.Instance( mod, __imports );
        __load( instance );
        return Module.exports;
    } else {
        const __promise = fetch( "unigame.wasm" )
            .then( response => response.arrayBuffer() )
            .then( bytes => WebAssembly.instantiate( bytes, __imports ) )
            .then( results => {
                __load( results.instance );
                console.log( "Finished loading Rust wasm module 'unigame'" );
                return Module.exports;
            })
            .catch( error => {
                console.log( "Error loading Rust wasm module 'unigame':", error );
                throw error;
            });

        Rust.unigame = __promise;
        return __promise;
    }
}));
