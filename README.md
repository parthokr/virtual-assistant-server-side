## Virtual-Assistant server side
### This repo contains the server side code to manage user and command for [this](https://github.com/ParthoKR/virtual-assistant) application
---
# How to get this server up and running?
> This server requires MySQL database to manage data, so assuming you have MySQL installed and run on your systam
> Create a database with name "virtual-assistant" at MySQL

* Open up terminal, enter the following command and hit return
* `git clone https://github.com/ParthoKR/virtual-assistant-server-side.git`
* `cd virtual-assistant-server-side`
* `touch config.js`
> Flesh out `config.js` as per your info, here is an example
    ``
    const config = {
    service: "gmail",
    auth: {
        user: "john.doe@gmail.com",
        pass: "yourpassword",
    },
    };
    module.exports = {
        config
    }
    `` 
* Execute `virtual-assistant.sql` from the root directory onto your database
* Now on terminal enter `node index`
* Bingo! You are all set up to go!
