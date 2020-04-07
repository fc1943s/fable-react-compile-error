namespace Test

open Fable.React

module Library =
    let throwsCompileError () =
        Hooks.useRef () |> ignore // Delete line to compile

