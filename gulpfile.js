var gulp = require( "gulp" );
var when = require( "when" );

var spawn = require( "cross-spawn" );
var del = require( "del" );

gulp.task( "clean", function () {
    return del( [ "build", "fin" ] );
} );

gulp.task( "build", function () {
    return when.all( [
        gulp.src( "src/**/*" ).pipe( gulp.dest( "build/src" ) )
    ].concat(
        [
            // TODO: Move chops.cene into its own npm module, and add
            // the name of that module to this array.
        ].map( function ( lib ) {
            return gulp.src(
                "node_modules/" + lib + "/cenelib/**/*"
            ).pipe( gulp.dest( "build/lib/" + lib ) );
        } )
    ) ).then( function ( ignored ) {
        return when.promise( function ( resolve, reject ) {
            spawn( "npm",
                "run cene -- build.cene -i build/ -o fin/".split(
                    " " ),
            {
                stdio: [ "ignore", "inherit", "inherit" ]
            } ).on( "close", function ( code ) {
                if ( code !== 0 )
                    return void reject(
                        new Error(
                            "Cene exited with code " + code ) );
                
                resolve( null );
            } );
        } );
    } );
} );
