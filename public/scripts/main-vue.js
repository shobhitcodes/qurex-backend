const { createApp } = Vue
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUzZWFiNTMzMTFkY2QwNGIyOWIxODgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjY0NDM5OTJ9.7-leD0U3__ET_dTj_Z65aLzAoONwLqA2fFTrK_Lh15s';
timeOutDeplay = 1000;
createApp({
    data() {
        return {
            selectedGender: '',
            selectedIssue: '',
            selectedValue: '',
            conversationId: '',
            userEmail: '',
            userName: '',
            messagesObj: {
                selectType: 'Gender',
                _id: 0,
                type: 'ques',
                note_type: 'question',
                inputType: 'Radio',
                message: `Hello! I am Dr. Quro. It's really nice to meet you. Please let me know your gender.`,
                children: [
                    {
                        _id: 1,
                        node_type: 'radio',
                        message: 'I am a Male',
                        value: "MALE"
                    },
                    {
                        _id: 2,
                        node_type: 'radio',
                        message: 'I am a Female',
                        value: "FEMALE"
                    }
                ]
            },
            conversationArray: [],
            loading: false
        }
    },
    methods: {
        openAuthModal() {
            document.getElementById('myModal').style.display = 'block'
        },
        async loginAuthUser() {
            return fetch("http://localhost:3700/api/drQuro/updateConversation/" + this.conversationId, {
                    headers: {
                        "x-auth-token": token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ 
                    "userEmail": this.userEmail,
                    "userName": this.userName,  
                    })
                })
                    .then((response) => response.json())
                    .then(val => {
                        window.location.href = './result?c=' + this.conversationId;
                    })
        },
        async submitResponse() {
            this.loading = true;
           
            console.log(this.messagesObj);
            if (this.messagesObj.selectType === 'Gender') {
                this.selectedGender = this.selectedValue;
                this.conversationArray.push({type: 'ans', value: this.selectedValue })
                this.scrollToBottom()

                await this.getIssuesBasedOnGender(this.selectedGender);
                this.selectedValue = '';
                console.log({conversationArray: this.conversationArray});
                return
            }
            if (this.messagesObj.selectType === 'Issues') {
                this.selectedIssue = this.selectedValue;
                this.conversationArray.push({type: 'ans', value: this.selectedValue })
            this.scrollToBottom()

                await this.startConversation(this.selectedGender, this.selectedValue);
                this.scrollToBottom()
                
                this.selectedValue = '';
                console.log({conversationArray: this.conversationArray});
                return
            }
            if (this.messagesObj.selectType === 'Node') {
                
                let selectedChild;
                if(this.selectedValue && Array.isArray(this.selectedValue)) {
                    let selectedChildren = this.messagesObj.children.filter(x => this.selectedValue.includes(x._id));
                    console.log({selectedChildren});
                    if(selectedChildren[0].message === 'None of these' || selectedChildren[0].message === 'None of the above') {
                        this.conversationArray.push({type: 'ans', value: selectedChildren && selectedChildren[0] ? selectedChildren[0].message :'' })
                    } else {
                        this.conversationArray.push({type: 'ans', value: selectedChildren, ansType: selectedChildren[0].inputMessageType })
                    }
                }
                else if(this.selectedValue && this.selectedValue.isInputs) {
                    let message = '';
                    this.messagesObj.children.forEach(c => {
                        message += `${c.message} : ${this.selectedValue[c._id]} <br>`;
                    })
                    this.conversationArray.push({type: 'ans', value:  message  })

                }
                else {
                    selectedChild = this.messagesObj.children.find(x => x._id === this.selectedValue)
                    this.conversationArray.push({type: 'ans', value: selectedChild ? selectedChild.message :'' })
                }

                this.scrollToBottom()
                
                await this.getNextResponse(this.selectedValue);
                this.scrollToBottom()

                this.selectedValue = '';
                if (this.messagesObj.inputType === 'Checkbox') {
                    this.selectedValue = []
                }
                if (this.messagesObj.inputType === "Input") {
                    this.selectedValue = {isInputs: true}
                }
                console.log({conversationArray: this.conversationArray});
                setTimeout(() => {
                    
                    this.scrollToBottom()
                }, 500);

                return
            }
            

        },
        getIssuesBasedOnGender(selectedGender) {
            console.log(selectedGender);
            setTimeout(async () => {
                
                return fetch("http://localhost:3700/api/drQuro/getIssuesByGender/" + selectedGender, {
                    headers: {
                        "x-auth-token": token
                    },
                })
                    .then((response) => response.json())
                    .then(val => this._pushIssues(val.data))
            }, timeOutDeplay);
        },
        _pushIssues(issues) {
            const issueMessage = {
                selectType: 'Issues',
                _id: 0,
                note_type: 'question',
                inputType: 'Radio',
                message: `Please let me know what issue you are facing.`,
                children: [
                ]
            }
            issues.forEach(issue => {
                issueMessage.children.push({
                    _id: 2 + issueMessage.children.length + 1,
                    node_type: 'radio',
                    message: issue,
                    value: issue
                })
            });
            this.messagesObj = (issueMessage);
            this.addToQuestion(this.messagesObj)
            this.loading = false;

            console.log(this.messagesObj)
            this.scrollToBottom()
        },
        startConversation(selectedGender, selectedIssue) {
            setTimeout(async () => {
                return fetch("http://localhost:3700/api/drQuro/startConversation/", {
                    headers: {
                        "x-auth-token": token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            "gender": selectedGender,
                            "issue": selectedIssue,
                            "userEmail": this.userEmail,
                            "userName": this.userName,
                        })
                })
                    .then((response) => response.json())
                    .then(val => this.addConversation(val.data))
            }, timeOutDeplay)
        },
        addConversation(val) {
            if (!val.isCompleted) {
                this.conversationId = val.conversationId;
                val.rootNode.children.forEach(x => x.value = x._id);
                val.rootNode.selectType = 'Node';
                if (val.rootNode.inputMessageType === 'Image') {
                    val.rootNode.children.forEach(x => {
                        x.inputMessageType = 'Text';
                        if (x.media_url !== 'null')
                            x.inputMessageType = 'Image'

                    })
                }

                this.messagesObj = val.rootNode;
                this.addToQuestion(this.messagesObj)
                console.log('conversationAdded', this.messagesObj);
                this.loading = false;
                this.scrollToBottom()

            } else {
                this.openAuthModal();
                // window.location.href = './result.html?c=' + this.conversationId
            }
        },
        getNextResponse(selectedNodeId) {
            setTimeout(async () => {
                return fetch("http://localhost:3700/api/drQuro/addToConversation/" + this.conversationId, {
                    headers: {
                        "x-auth-token": token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ "selectedNode": selectedNodeId, "questionNodeId": this.messagesObj._id  })
                })
                    .then((response) => response.json())
                    .then(val => this.addConversation(val.data))
            },timeOutDeplay)

        },
        restartCalculation() {
            window.location.reload()
        },
        addToQuestion(question){

            const messages = question.message.split('<br><br>');
            
            messages.forEach(m => {
                this.conversationArray.push({type: 'ques', value: m})
                this.scrollToBottom()
            })
            
            this.conversationArray[this.conversationArray.length - 1].messagesObj = question;
            this.updateSelectedValue();
           

            this.scrollToBottom()

        },
        edit(index) {
            console.log({index});
            this.conversationArray.splice(index);
            this.messagesObj = this.conversationArray[this.conversationArray.length - 1].messagesObj;
            this.updateSelectedValue();
            console.log({c: this.conversationArray});
        },
        scrollToBottom() {
            var element = document.getElementById("messages");   
            element.scrollTop = element.scrollHeight;
            setTimeout(() => {
                var element = document.getElementById("messages");   
                element.scrollTop = element.scrollHeight;
               
            }, 1);
        },
        updateSelectedValue() {
            if(this.messagesObj.inputType === "Checkbox") {
                this.selectedValue = []
            }
            if(this.messagesObj.inputType === "Input") {
                this.selectedValue = {isInputs: true}
            }
        }

    },
    mounted() {
        console.log('Vue init');
        this.addToQuestion(this.$data.messagesObj)
        console.log('conversation', this.conversationArray);

    }
})
    .mount('#app')

