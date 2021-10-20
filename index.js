const element = document.querySelector("#head");
const btn = document.querySelector('#btn-click');
const navLink = document.querySelectorAll('.dropdown');
const clearFile = document.querySelector('#clear-file');
const saveFile = document.querySelector('#save-file');
const navTabs = document.querySelector('#tabs');
const tabContent = document.querySelector('#myTabContent');
const runTime = document.querySelector('#runtime');
const btnShowHide = document.getElementById('btn-show-hide');
const main = document.getElementById('home');

var mEditor;

const syntaxHighlighting = {
    
        keywords: [
            'print','if', 'var','class'
        ],
        operators : [
            '-', '+' ,'='
        ],
          // we include these common regular expressions
        symbols:  /[=><!~?:&|+\-*\/\^%]+/,

        // update to own escape strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer : {
            root:[
                [/[a-z_$][\w$]*/, {cases: {'@keywords' : 'keyword','@default': 'identifier'}}
                ],
                [/[A-Z][\w\$]*/,'type.identifier'],
                {include: '@whitespace'},
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],//not implemented?
                [/@symbols/, { cases: { '@operators': 'operator',
                              '@default'  : '' } } ],
                
                // numbers
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],

                //strings
                [/[;,.]/, "delimiter"],
                [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
                [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

            ],
            comment: [
                [/[^\/*]+/, 'comment' ],
                [/\/\*/,    'comment', '@push' ],    // nested comment
                ["\\*/",    'comment', '@pop'  ],
                [/[\/*]/,   'comment' ]
            ],

            string: [
                [/[^\\"]+/,  'string'],
                [/@escapes/, 'string.escape'],
                [/\\./,      'string.escape.invalid'],
                [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/,       'comment', '@comment' ],
                [/\/\/.*$/,    'comment'],
              ],
        }
    
};



window.onload = () => {
    monaco.languages.register({ id: 'roto' });
    monaco.languages.setMonarchTokensProvider('roto', syntaxHighlighting);
    mEditor = monaco.editor.create(home, {
        value: 'print("Hello world!!")',
        language: "roto"
    });
}

navLink.forEach(function (element) {
    element.addEventListener('mouseover', function () {
        element.setAttribute('style', 'background-color: lightgrey;');
    });
    element.addEventListener('mouseout', function () {
        element.removeAttribute('style');
    });
});
clearFile.addEventListener('click', function () {
    mEditor.setValue('')
});

btnShowHide.addEventListener('click', () => {
    if(/btn-warning/.test(btnShowHide.className)){
        btnShowHide.className = 'btn btn-sm btn-success';
        btnShowHide.textContent = 'Show';
        runTime.className = 'hide';
        document.getElementById('runTimeContent').removeAttribute('style');
        main.style.height = '390px';

    }
    else{
        btnShowHide.className = 'btn btn-sm btn-warning';
        btnShowHide.textContent = 'Hide';
        runTime.className = '';
        document.getElementById('runTimeContent').setAttribute('style','border: 1px solid lightgray;');
        main.style.height = '300px';

    }

});

saveFile.addEventListener('click', () => {
    let link = document.createElement('a');
    //TODO: capture txt
    link.download = 'script.rt';

    let blob = new Blob([mEditor.getValue()], {type: 'text/plain'});

    link.href = URL.createObjectURL(blob);
    link.click()
    URL.revokeObjectURL(link.href);
});
