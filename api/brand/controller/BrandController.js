const ERROR_LIST = require("../../helpers/errorList");
const ERROR_MESSAGE = require("../../helpers/errorMessage");
const ResponseStatus = require("../../helpers/responseStatus");
const Brand = require('../../models/BrandModel');
const Features = require('../../helpers/features')
const Validator = require('validatorjs');



class BrandController {
    async index(req, res, next) {
        try {
            const resultPerPage = 5;
            const brandCount = await Brand.countDocuments();
            const feature  = new Features(Brand.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage);
            const brands = await feature.query;
            return res
                .status(ERROR_LIST.HTTP_OK) 
                .json({
                    success: true,
                    brands
                });
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        }
    }

    async show(req, res, next) {
        try {
            const brand = await Brand.findById(req.params.id);
            if(brand){
                return res
                    .status(ERROR_LIST.HTTP_OK)
                    .json({ 
                        success: true,
                        brand
                     });
            }
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        }
    }
    async create(req, res, next) {
        try {
            //req files
            const validate = new Validator(req.body, {
                name: "required"
            });
            if(validate.fails()){
                return res
                .status(ERROR_LIST.HTTP_UNPROCESSABLE_ENTITY)
                .send(ResponseStatus.failure(ERROR_MESSAGE.HTTP_UNPROCESSABLE_ENTITY, validate.errors));
            }
            const exist = await Brand.findOne({
                name: req.body.name
            });
            if(exist){
                return res.status(ERROR_LIST.HTTP_OK)
                .send(ResponseStatus.success("Brand already exist", exist));
            }
            let create = new Brand({
                ...req.body
            });
            create = await create.save();
            if (create){
                return res
                .status(ERROR_LIST.HTTP_OK)
                    .send(ResponseStatus.success("Brand created successfully", create));
            }
            return res 
                .status(ERROR_LIST.HTTP_OK)
                .send(ResponseStatus.failure("Brand could not be created",{}));
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        } 
    }
    async update(req, res, next) {
        try {
            let brand = await Brand.findById(req.params.id);
            if(!brand){
                return res.status(500).json({
                    success: false,
                    message: "Brand is not found with this id"
                })
            }
            brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
                useUnified: false
            });
            return res
                .status(ERROR_LIST.HTTP_OK)
                .json({
                    success: true,
                    brand 
                });
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        }
    }
    async remove(req, res, next) {
        try {
            const brand = await Brand.findById(req.params.id);
            if(!brand){
                return res.status(500).json({
                    success: false,
                    message: "Brand is not found with this id"
                })
            }
            await brand.remove();
            return res
                .status(ERROR_LIST.HTTP_OK)
                .json({ 
                    success: true,
                    message: "Brand Deleted Successfully"
                 });
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        }
    }
}

module.exports = new BrandController();