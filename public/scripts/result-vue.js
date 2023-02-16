const { createApp } = Vue
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUzZWFiNTMzMTFkY2QwNGIyOWIxODgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjY0NDM5OTJ9.7-leD0U3__ET_dTj_Z65aLzAoONwLqA2fFTrK_Lh15s';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2EwNzJiODEzNGNiNzMxZjZiOTQ4MDEiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNjcyNzQyODY5fQ.inHCQ4Zp0mCjyivNsKavzcwoh7UTj9hJMiU3OMnPM1w'
const url = 'http://localhost:3700';
// const url = 'https://qurex.onrender.com';
createApp({
    data() {
        return {
            conversationId: '',
            conversationResult: null,
            isLoaded: false
        }
    },
    methods: {
        getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },
        getConversationOutput(conversationId) {
            return fetch(url + "/api/drQuro/generateConversationResult/" + conversationId, {
                headers: {
                    "x-auth-token": token,
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => response.data)

        },
        print() {
            var divContents = document.getElementById("printdivcontent").innerHTML;
            var printWindow = window.open('', '');
    
            printWindow.document.write('<html><head><title>Print DIV Content</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">');
            printWindow.document.write('</head><body >');
            printWindow.document.write(divContents);
            printWindow.document.write('</body></html>');
            printWindow.print();
            printWindow.close()
        },
        back() {
            window.location.href = '/'
        },

            replace:  (st, rep, repWith) => {
              const result = st.split(rep).join(repWith)
              return result;
            }
          
    },
    filters: {
        replace: function (st, rep, repWith) {
          const result = st.split(rep).join(repWith)
          return result;
        }
    },
    async mounted() {
        const conversationResult = await this.getConversationOutput(this.getParameterByName('c'))
        this.isLoaded = true;
        if(conversationResult && conversationResult.causes) {
            // conversationResult.causes.forEach(c => {
            //     c.replaceAll("Ä¢", '')
            //     console.log(c);
            // });

            Object.keys(conversationResult).forEach(k => {
                let eles = conversationResult[k];
                if(Array.isArray(eles)) {
                    let ar = [];
                    eles.forEach(e => {
                        if(e && e !== 'null') {

                            let q = e.split('|');
                            ar.push(...q);
                        }
                    })
                    // console.log(ar)
                    conversationResult[k] = ar;
                }
            })
        }
        this.conversationResult = conversationResult;
        console.log(conversationResult)
    }
}).mount('#app')


// Object.keys(node).forEach(k => {
//     let ela = node[k];
//     if(typeof ela === 'string') {
//         const s = ela.split('|');
//         if(s.length > 1) {
//             let str = '';
//             s.forEach((x, i) => {
//                 str += `${i+1}. ${x}` + '<br>'
//             });
            
//              node[k] = str;
//         }
//     }
// })