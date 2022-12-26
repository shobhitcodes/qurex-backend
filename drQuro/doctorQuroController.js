const utils = require('../helpers/utils');
const fs = require('fs');
const path = require('path');
const reader = require('xlsx')
const mongoose = require('mongoose');
const drOuroDB = require('../models/drQuro');
const drOuroConversation = require('../models/drQuroUserConversation');


module.exports.getInit = getInit;
module.exports.getIssuesByGender = getIssuesByGender;
module.exports.getInitNode = getInitNode;
module.exports.getChildrenByNode = getChildrenByNode;
module.exports.startConversation = startConversation;
module.exports.getConversationById = getConversationById;
module.exports.addToConversation = addToConversation;
module.exports.generateConversationResult = generateConversationResult;

/**
 * @async
 * @description Request handler for fetching doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
//  async function getInit(req, res) {
//     try {
//         const init = {
//             options: [
//                 {
//                     text: 'I am a Man',
//                     genderValue: 'MALE',
//                     options: [
//                         {
//                             issues: [
//                                 {
//                                     name: 'Erection Issues / Erectile Dysfunction'
//                                 },
//                                 {
//                                     name: 'Premature Ejaculation'
//                                 },
//                                 {
//                                     name: 'STD/STI'
//                                 },
//                                 {
//                                     name: 'Painful sex'
//                                 },
//                                 {
//                                     name: 'Low fertility'
//                                 }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     text: 'I am a Woman',
//                     genderValue: 'FEMALE',
//                     options: [
//                         {
//                             issues: [
//                                 {
//                                     name: 'Painful sex'
//                                 },
//                                 {
//                                     name: 'Low fertility',
//                                     jsonObj: JSON.parse(await fs.readFileSync(path.join(__dirname,'./assets/female_infertility.json')))
//                                 },
//                                 {
//                                     name: 'PCOS/PCOD'
//                                 },
//                                 {
//                                     name: 'Painful period'
//                                 },
//                             ]
//                         }
//                     ]
//                 }
//             ]

//         }
//         res.json(utils.formatResponse(1, init));
//     } catch (err) {
//         console.error('Error on doctor getById handler: ', err);
//         res.json(utils.formatResponse(0, err));
//     }
// }

const drQuroExcels = [
    {
        type: 'FEMALE',
        files: [
            {
                name: 'Female Infertility',
                dist: './assets/femal_infertility_revised-new.csv'
            },
            {
                name: 'Pain during Sex',
                dist: './assets/pain_during_sex_female_final.csv'
            },
            {
                name: 'Painful Period',
                dist: './assets/painful_period.csv'
            },
            {
                name: 'PCOD',
                dist: './assets/PCOD_final-new.csv'
            },
        ]
    },
    {
        type: 'MALE',
        files: [
            {
                name: 'ED',
                dist: './assets/male/ED_final_csv_file-new.csv'
            },
            {
                name: 'Male Infertility',
                dist: './assets/male/male_infertility_final.csv'
            },
            {
                name: 'Pain during Intercourse',
                dist: './assets/male/pain_during_intercourse_male_final-new.csv'
            },
            {
                name: 'Premature Ejaculation',
                dist: './assets/male/premature_ejaculation_final-new.csv'
            },
            {
                name: 'STI',
                dist: './assets/male/sti_male_final.csv'
            },

        ]
    }
]

async function getInit(req, res) {

    for (let dr = 0; dr < drQuroExcels.length; dr++) {
        const excel = drQuroExcels[dr];

        for (let e = 0; e < excel.files.length; e++) {
            const element = excel.files[e];
            const file = reader.readFile(path.join(__dirname, element.dist));
            let data = []

            const sheets = file.SheetNames

            for (let i = 0; i < sheets.length; i++) {
                const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
                temp.forEach((res) => {
                    data.push(res)
                })
            }
            data.forEach(node => {
                node._id = mongoose.Types.ObjectId()
                if (node.child_node_id === "null") {
                    node.child_node_id = null;
                    node.children = [];
                    node.childrenArr = [];

                }
                else {
                    let chileNodesChildren = (node.child_node_id + '').split('|');
                    node.children = chileNodesChildren;
                    node.children.forEach(childNodesId => {
                        childNodesId = parseInt(childNodesId)
                    });
                    node.childrenArr = [];
                }
            });

            for (let d = 0; d < data.length; d++) {
                let node = data[d];
                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => {
                        let childObj = data.find(c => c.node_id == child);
                        if (childObj && childObj._id) {
                            node.childrenArr.push(childObj._id);
                            childObj.parentNode = node._id;
                        }
                    })
                }

                const inserted = await drOuroDB.create({
                    gender: excel.type,
                    name: element.name,
                    ...node,
                    _id: node._id
                })
            }
        }
    }
    res.json(utils.formatResponse(1, true));
}

async function getIssuesByGender(req, res) {
    try {
        const gender = req.params.gender;
        const data = await drOuroDB.find({ gender }).distinct('name')
        res.json(utils.formatResponse(1, data));
    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}

async function getInitNode(req, res) {
    try {
        const issueName = req.params.issueName;
        const node = await drOuroDB.aggregate([
            {
                $match: { name: issueName, node_id: '0' }
            },
            {
                $lookup:
                {
                    from: 'drQuroNew',
                    localField: 'childrenArr',
                    foreignField: '_id',
                    as: 'children'
                }
            }
        ])
        res.json(utils.formatResponse(1, node));

    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}

async function getChildrenByNode(req, res) {
    try {
        const nodeId = req.params.nodeId;
        const node = await drOuroDB.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(nodeId) }
            },
            {
                $lookup:
                {
                    from: 'drQuroNew',
                    localField: 'childrenArr',
                    foreignField: '_id',
                    as: 'children'
                }
            }
        ])
        res.json(utils.formatResponse(1, node));
    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}


async function startConversation(req, res) {
    try {
        const userId = req.user._id;
        const { gender, issue, userName, userEmail } = req.body;

        const inActivateOldConversations = await drOuroConversation.updateMany({ userId }, { active: false })

        const node = await drOuroDB.aggregate([
            {
                $match: { name: issue, node_id: '0' }
            },
            {
                $lookup:
                {
                    from: 'drQuroNew',
                    localField: 'childrenArr',
                    foreignField: '_id',
                    as: 'children'
                }
            },
            {
                $project: {
                    "message": 1,
                    "node_type": 1,
                    "media_url": 1,
                    "children.message": 1,
                    "children._id": 1,
                    "children.node_type": 1,
                    "children.media_url": 1,
                }
            }
        ]);

        const conversation = await drOuroConversation.create({
            userId,
            gender,
            issue,
            userEmail,
            userName,
            conversations: node
        });

        node[0].inputType = _getInputType(node[0])
        node[0].inputMessageType = _getInputMessageType(node[0])
        const response = {
            conversationId: conversation._id,
            rootNode: node ? node[0] : null
        }

        res.json(utils.formatResponse(1, response));


    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}


async function getConversationById(req, res) {
    try {
        const conversationId = req.params.id;
        const userId = req.user._id;

        const conversation = await drOuroConversation.find({ active: true, _id: conversationId, userId })
        res.json(utils.formatResponse(1, conversation));

    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}

async function addToConversation(req, res) {
    try {
        const conversationId = req.params.id;
        const userId = req.user._id;
        const selectedNode = req.body.selectedNode;
        const questionNodeId = req.body.questionNodeId;



        const conversation = await drOuroConversation.findOne({ active: true, _id: conversationId, userId })
        if (!conversation) throw 'Invalid Conversation Id';

        let node;
        const isSelectedNodeArray = Array.isArray(selectedNode);
        const isSelectedNodeObject = typeof selectedNode === 'object' && !Array.isArray(selectedNode);
        const isSelectedNodeString = typeof selectedNode === 'string';

        if (isSelectedNodeArray) {
            const nodes = await drOuroDB.find({ _id: { $in: selectedNode } });
            nodes.forEach(node => _addNodeToConversationObj(conversation, node))
            node = nodes[0]
        }

        if (isSelectedNodeObject) {
           if(conversation.issue === 'PCOD' && selectedNode.isInputs) {
                delete selectedNode.isInputs;
                const nodes = await drOuroDB.find({ _id: { $in: Object.keys(selectedNode) } }); 
                let weight, height; 
                nodes.forEach(x => {
                    if (x.message.includes("Weight")) weight = selectedNode[x._id];
                    if (x.message.includes("Height")) height = selectedNode[x._id];
                })
                const BMI = weight / (height ** 2);
                if(BMI > 30) {
                    conversation.srCheckValue += 5;
                }
                node = nodes[0]
           }
        }

        if (isSelectedNodeString) {
            node = await drOuroDB.findOne({ _id: selectedNode });
            _addNodeToConversationObj(conversation, node);
        }


        let childNodes;
        let isCompleted = false;

        const srObj = _getNodeTypeSRValueFunctions(node);
        if(srObj.srValue) conversation.srCheckValue += srObj.srValue;
        if(srObj.isFinalSRCheck) {
            if(conversation.issue === 'PCOD') {
                const lastNodeType =  (conversation.srCheckValue < 15)  ? 'dsr0' : 'dsr1';
                const lastNode = await drOuroDB.findOne({ node_type: lastNodeType, name: 'PCOD'});
                conversation.isCompleted = true;
                _addNodeToConversationObj(conversation, lastNode)
                isCompleted = true;
            }
        }
        

        if(conversation.gender === 'MALE' && 
        (conversation.issue === 'ED' || conversation.issue === 'Premature Ejaculation' || conversation.issue === 'STI')) {
            if(node.node_type.split('|').some(x => x === 'dr')) {
                conversation.isDRValue = true;
            }
        }
        if(conversation.gender === 'MALE' && conversation.issue === 'Premature Ejaculation') {
            if(node.node_type.split('|').some(x => x === 'or')) {
                conversation.isORSelected = true;
            }
            const questionNode = await drOuroDB.findOne({ _id:  questionNodeId});

            if(questionNode.node_type === 'aq') {
                conversation.isAndSelected = node.node_type === 'ar'; 
            }
        }


        

        if (node.node_type !== 'd' && !isCompleted) {

            childNodes = await drOuroDB.aggregate(
                [
                    {
                        $match: { _id: { $in: node.childrenArr } }
                    },
                    {
                        $lookup:
                        {
                            from: 'drQuroNew',
                            localField: 'childrenArr',
                            foreignField: '_id',
                            as: 'children'
                        }
                    },
                    // {
                    //     $project: {
                    //         "message": 1,
                    //         "children.message": 1,
                    //         "children._id": 1,
                    //         "children.node_type": 1,
                    //         "node_type": 1
                    //     }
                    // }
                ]
            );

            if(conversation.issue === 'Female Infertility') {
                if(node.node_type.includes('mr2chk')) {
                    if(node.node_type.includes('mr2chk2')) childNodes = childNodes.filter(x => x.node_type.includes('mr1'));
                    if(node.node_type.includes('mr2chk1')) childNodes = childNodes.filter(x => x.node_type.includes('d'));
                }
                

                if(childNodes[0].node_type.includes('mr0') || childNodes[0].node_type.includes('mr1')) {
                    childNodes[0].node_type = childNodes[0].node_type.replace('mr0','')
                    childNodes[0].node_type = childNodes[0].node_type.replace('mr1','')
                    childNodes[0].node_type = childNodes[0].node_type.replace('|','')
                    childNodes[0].node_type = childNodes[0].node_type.trim()
                }
            }     

            if(conversation.gender === 'MALE' && conversation.issue === 'ED') {
                if(node.node_type.split('|').some(x => x === 'drchk')) {
                    if(conversation.isDRValue === true) childNodes = childNodes.filter(x => x.node_type.includes('d1'));
                    else childNodes = childNodes.filter(x => x.node_type.includes('d0'));
                    childNodes[0].node_type = 'd';
                }
            }

            if(conversation.gender === 'MALE' && conversation.issue === 'Premature Ejaculation') {
                
                if(node.node_type.split('|').some(x => x === 'gchk')) {
                    if(conversation.isORSelected && conversation.isAndSelected) {
                        childNodes = childNodes.filter(x => x.node_type.includes('g1'));
                    } else {
                        childNodes = childNodes.filter(x => x.node_type.includes('g0'));
                    }
                }
                if(node.node_type.split('|').some(x => x === 'drchk')) {
                    if(conversation.isDRValue) {
                        childNodes = childNodes.filter(x => x.node_type.includes('d1'));  
                    } else {
                        childNodes = childNodes.filter(x => x.node_type.includes('d0'));
                    }
                }

                if(node.node_type.split('|').some(x => x === 'gchk') && node.node_type.split('|').some(x => x === 'drchk')) {
                    childNodes = childNodes[0].children
                }
                
            }

            if(conversation.gender === 'MALE' && conversation.issue === 'STI') {
                if(node.node_type.split('|').some(x => x === 'drchk')) {
                    if(conversation.isDRValue) {
                        childNodes = childNodes.filter(x => x.node_type.includes('d1'));  
                    } else {
                        childNodes = childNodes.filter(x => x.node_type.includes('d0'));
                    }

                    conversation.isCompleted = true;
                    _addNodeToConversationObj(conversation, childNodes[0])
                    isCompleted = true;
                }
            }


            if (childNodes.length === 1 && childNodes[0].node_type === 'd') {
                conversation.isCompleted = true;
                _addNodeToConversationObj(conversation, childNodes[0])
                isCompleted = true;
            }
        } else {
            conversation.isCompleted = true;
            isCompleted = true;
        }

        await conversation.save();

        let response = {};
        if (isCompleted) {
            response.conversationId = conversationId;
        } else {
            response.conversationId = conversation._id;
            response.rootNode = childNodes[0];
            response.rootNode.inputType = _getInputType(response.rootNode);
            response.rootNode.inputMessageType = _getInputMessageType(response.rootNode);
        }
        response.isCompleted = isCompleted;

        res.json(utils.formatResponse(1, response));

    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}


function _getInputType(node) {
    if (node.node_type) {
        const types = node.node_type.split('|');
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            if (type === 'mrq') return 'Checkbox'
            if (type === 'gq' || type === 'dr' || type === 'aq' || type === 'imgq') return 'Radio'
            if (type === 'tq') return 'Input'
           

        }
    }
}
function _getInputMessageType(node) {
    if (node.node_type) {
        const types = node.node_type.split('|');
        if (types.includes('img') || types.includes('imgq')) return 'Image';
        else return 'Text'
        // for (let i = 0; i < types.length; i++) {
        //     const type = types[i];
        //     if(type === 'img') return 'Image'
        //     else return 'Text'

        // }
    }
}


function _addNodeToConversationObj(conversationObj, node) {
    const keys = [
        'major_symptom',
        'other_symptoms',
        'additional_information',
        'diagnosis',
        'recommended_doctor',
        'recommended_lab_test',
        'general_advice',
        'causes',
        'blog_url',
        'media_url',
        'details'
    ]

    keys.forEach(key => {
        if (node[key] !== 'null' && node[key] !== null && !conversationObj[key].some(x => x === node[key])) {
            conversationObj[key].push(node[key])
        }
    })
    conversationObj.conversations.push(node);
    return conversationObj;
}

async function generateConversationResult(req, res) {
    try {
        const conversationId = req.params.id;
        const userId = req.user._id;
        const conversationDetails = await drOuroConversation.findOne({ _id: conversationId, userId })
        
    /**
     * For ED Male Start
     */
        if(conversationDetails 
            && conversationDetails.gender === 'MALE' 
            && conversationDetails.issue === 'ED'
            && conversationDetails.diagnosis
            && conversationDetails.diagnosis.length > 0
            && conversationDetails.diagnosis[0].includes('<score_based_triaging>')
        ) {
            const type =  () => {
                if(conversationDetails.srCheckValue >= 5 && conversationDetails.srCheckValue <=7) return 'Severe';
                if(conversationDetails.srCheckValue >= 8 && conversationDetails.srCheckValue <=11) return 'Moderate';
                if(conversationDetails.srCheckValue >= 12 && conversationDetails.srCheckValue <=16) return 'Mild to Moderate';
                if(conversationDetails.srCheckValue >= 17 && conversationDetails.srCheckValue <=21) return 'Mild';
                if(conversationDetails.srCheckValue >= 22 && conversationDetails.srCheckValue <=25) return 'No';
            };
            conversationDetails.diagnosis[0] = conversationDetails.diagnosis[0].replace('<score_based_triaging>',  type())
        }
    /**
     * For ED Male End
     */
    
        res.json(utils.formatResponse(1, conversationDetails));


    } catch (error) {
        console.error(error)
        res.json(utils.formatResponse(0, error));
    }
}

function _getNodeTypeSRValueFunctions(node) {
    const nodeTypes = node.node_type.split('|');
    let srValue = 0, isFinalSRCheck = false;
    
    nodeTypes.forEach(type => {
        if(type.includes('sr') && !type.includes('srchk')) {
            const _srVal = Number(type.replace('sr', ''));
            srValue+=_srVal;
        }
        if(type.includes('srchk')) {
            isFinalSRCheck = true;
        }
    })
    return { srValue, isFinalSRCheck }
}

function getInputType(node) {
    try {
        if (node.node_type.split('|').includes('mr')) return 'checkbox';
        if (node.node_type.split('|').includes('r')) return 'radio';
        if (node.node_type.split('|').includes('r')) return 'radio';
    } catch (error) {
        throw error;
    }
}

async function _doGetChildNode(nodeId) {
    try {
        const node = await drOuroDB.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(nodeId) }
            },
            {
                $lookup:
                {
                    from: 'drQuroNew',
                    localField: 'childrenArr',
                    foreignField: '_id',
                    as: 'children'
                }
            }
        ])
        return node;
    } catch (error) {
        throw error
    }


}