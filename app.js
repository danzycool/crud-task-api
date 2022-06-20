const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');
const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');

/*
Middleware are used to intercept a request and response e.g express.json()

CORS - Cross Origin Request Security
backend - http://localhost:3000
frontend - http://localhost:4200

You could use 3rd party library to allow access by all IPs, by adding:
app.use(CORS());

But here, we will be adding Headers
*/
app.use(
    (request, response, next)=>{
        //Website you wish to allow to connect
        //response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        response.setHeader('Access-Control-Allow-Origin', '*');

        //Request method you wish to allow 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        //Request Headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

        /*
        Set to true if you need the website to include cookies in the requests
        sent to the API (e.g. in case you use sessions) 
        response.setHeader('Access-Control-Allow-Credentials', true);
        But we aren't logging in in this app
        */
         
        //Pass to next layer of middleware
        next();
    }
);

app.use(express.json()); /*added to avoid using 3rd party library
like "Body Parser". Helps our Express app understand requests coming in JSON format */

//Routes of REST API Endpoints or RESTful web services Endpoints

/*
TaskList = Create, Update, ReadTaskListById, ReadAllTaskList
Task = Create, Update, ReadTaskById, ReadAllTask
*/

// Routes of API endpoints for TaskList model
// Get All Task Lists
// http://localhost:3000/tasklists => [{TaskList},{TaskList}]
app.get('/tasklists', (req, res)=>{
    TaskList.find({})
    .then(lists=>{
        res.status(200).send(lists)
    })
    .catch(error=>{
        console.log(error)
    })
})

//Route for getting task by ID:
app.get('/tasklists/:taskListId', (req, res)=>{
    let taskListId = req.params.taskListId;
    TaskList.find({ _id: taskListId })
    .then(taskList=>{
        res.status(200).send(taskList)
    })
    .catch(error=>{
        console.log(error)
    })
})

//Route for fetching task
app.get('/tasks', (req, res)=>{
    Task.find({})
    .then(tasks=>{
        res.status(200).send(tasks);
    })
    .catch(error=>{
        console.log(error)
    })
})

//Route or endpoint for creating Tasklist
app.post('/tasklists', (req, res)=>{
    console.log(req.body); 

    let taskListObj = { 'title': req.body.title }; 
    TaskList(taskListObj).save()
    .then(taskLists=>{
        res.status(201).send(taskLists);
    })
    .catch(error=>{
        console.log(error)
    });
})

//Route for Full Update of an Object by ID
app.put('/taskLists/:id', (req, res)=>{
    TaskList.findOneAndUpdate( { _id: req.params.id }, { $set: req.body } )
    .then(resdata=>{
        res.status(200).send(resdata)
    })
    .catch(error=>{
        console.log(error)
    })
})

//Route for Partial Update, that is, update one field of an object by ID
app.patch('/taskLists/:id', (req, res)=>{
    TaskList.findOneAndUpdate( { _id: req.params.id }, { $set: req.body } )
    .then(taskList=>{
        res.status(200).send(taskList)
    })
    .catch(error=>{
        console.log(error)
    })
})

//Route for deleting a tasklist by ID
app.delete('/taskLists/:id', (req, res)=>{
    TaskList.findByIdAndDelete( req.params.id )
    .then(taskList=>{
        res.status(200).send(taskList)
    })
    .catch(error=>{
        console.log(error)
    })
})


app.listen(3000, ()=>{
    console.log('Server started on port 3000 successfully');
});

