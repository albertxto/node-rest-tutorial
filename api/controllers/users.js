const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
	//cek apakah email sudah terpakai
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if(user.length >= 1){
				//email lebih dari satu
				console.log('Email already exists');
				return res.status(409).json({
					message: 'Email already exists'
				});
			}else{
				//hash password
				bcrypt.hash(req.body.password, null, null, (err, hash) => {
					if(err){
						console.log(err);
						return res.status(500).json({
							error: err
						});
					}else{
						//buat user baru
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							username: req.body.username,
							email: req.body.email,
							password: hash
						});
						user
							.save()
							.then(result => {
								console.log(result);
								res.status(201).json({
									message: 'User created'
								});
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({
									error: err
								});
							});
					}
				});
			}
		});
};

exports.user_login = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if(user.length <= 0){
				return res.status(401).json({
					message: 'Authentication failed'
				});
			}else{
				//cek password
				bcrypt.compare(req.body.password, user[0].password, (err, result) => {
					if(err){
						return res.status(401).json({
							message: 'Authentication failed'
						});
					}
					if(result){
						//buat token dengan jsonwebtoken
						const token = jwt.sign(
							{
								username: user[0].username,
								email: user[0].email,
								userId: user[0]._id
							},
							process.env.JWT_KEY,
							{
								expiresIn: "1h"
							}
						);
						return res.status(200).json({
							message: 'Authentication successful',
							token: token
						});
					}
					res.status(401).json({
						message: 'Authentication failed'
					});
				});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.users_get_all = (req, res, next) => {
	User.find()
		.select('username email _id')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				users: docs.map(doc => {
					return {
						username: doc.username,
						email: doc.email,
						_id: doc._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3001/users/' + doc._id
						}
					}
				})
			}
			console.log(response);
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.users_get_user = (req, res, next) => {
	const id = req.params.userId;
	User.findById(id)
		.exec()
		.then(doc => {
			console.log("From database", doc);
			if(doc){
				res.status(200).json({
					user: doc,
					request: {
						type: 'GET',
						url: 'http://localhost/users/' + id
					}
				});	
			}
			else{
				res.status(404).json({ message: "No valid entry found for provided ID" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.user_update = (req, res, next) => {
	const id = req.params.userId;
	const updateOps = {};
	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	User.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.user_delete = (req, res, next) => {
	const id = req.params.userId;
	User.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'User deleted'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};