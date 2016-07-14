var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended : true }));

var server = app.listen(8000, function(){
	console.log('Listening on port 8000!');
})

mongoose.connect('mongodb://localhost/Animals');

var animalSchema = new mongoose.Schema({
	name: {type: String},
	age: {type: Number},
	gender: {type: String},
	family: {type: String}}, 
	{timestamps: true});

mongoose.model('animal', animalSchema);

var animal = mongoose.model('animal');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	animal.find({family:'bunny'}, function(err, bunnies){
		if(err){
			console.log('Error displaying all bunnies');
		}
		else{
			res.render('index', {bunnies:bunnies});
		}
	});
})

app.get('/bunny/new', function(req, res){
	res.render('new');
})

app.post('/bunnies/new_method', function(req, res){
	var animalInstance = new animal({name:req.body.name, age:req.body.age, gender:req.body.gender, family: 'bunny'});
	animalInstance.save(function(err){
		if(err){
			console.log('New bunny error');
		}
		else{
			res.redirect('/');
		}
	});
})

app.get('/bunnies/:id/edit', function(req, res){
	animal.findOne({_id:req.params.id}, function(err, bunny){
		if(err){
			console.log('Edit bunny error');
		}
		else{
			res.render('edit', {bunny:bunny});
		}
	});
})
app.post('/bunnies/edit_method', function(req, res){
	animal.findOne({_id:req.body.id}, function(err, bunny){
		bunny.name = req.body.name;
		bunny.age = req.body.age;
		bunny.gender = req.body.gender;
		console.log(req.body);

		bunny.save(function(err){
			console.log('.save bunny error');
			res.redirect('/');
		});	
	});
})

app.post('/bunnies/delete', function(req, res){
	animal.remove({_id:req.body.id}, function(err){
		if(err){
			console.log('Delete bunny error');
		}
		else{
			res.redirect('/');
		}
	});
})

app.get('/bunnies/:id', function(req, res){
	animal.findOne({_id:req.params.id}, function(err, bunny){
		if(err){
			console.log('show bunny error');
		}
		else{
			res.render('show', {bunny:bunny});
		}
	});
})











