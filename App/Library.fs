namespace Test

open Fable.React

    
module App =
    let doesNotThrowCompileError () =
        Hooks.useRef () |> ignore
    
    doesNotThrowCompileError ()
    
    Library.throwsCompileError ()

