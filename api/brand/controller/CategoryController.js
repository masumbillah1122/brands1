const ERROR_LIST = require("../../helpers/errorList");
const ERROR_MESSAGE = require("../../helpers/errorMessage");
const ResponseStatus = require("../../helpers/responseStatus");
const Category = require('../../models/CategoryModel');
const slugify = require('slugify');
const Validator = require('validatorjs');
const Features = require('../../helpers/features');
const { failure } = require("../../helpers/responseStatus");
const FileUpload = ('../../helpers/index.js')

class CategoryController {
    async addCategory(req, res, next) {
        try {
            //req files
            let file = req.files;
            const validate = new Validator(req.body, {
                name: "required"
            });
            if (validate.fails()) {
                return res
                    .status(ERROR_LIST.HTTP_UNPROCESSABLE_ENTITY)
                    .send(ResponseStatus.failure(ERROR_MESSAGE.HTTP_UNPROCESSABLE_ENTITY, validate.errors));
            }
            const exist = await Category.findOne({
                name: req.body.name
            });
            if (exist) {
                return res.status(ERROR_LIST.HTTP_OK)
                    .send(ResponseStatus.success("Category already exist", exist));
            }
            let create = new Category({
                ...req.body
            });
            let uploadFile = file ? await FileUpload(file.banner, "../../uploads/banner") : '';
            create.banner = uploadFile;
            create = await create.save();
            if (create) {
                return res
                    .status(ERROR_LIST.HTTP_OK)
                    .send(ResponseStatus.success("Category created successfully", create));
            }
            return res
                .status(ERROR_LIST.HTTP_OK)
                .send(ResponseStatus.failure("Category could not be created", {}));
        } catch (err) {
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(ResponseStatus.failure(
                    ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR,
                    err
                ));
        } 
        //try{
        //     const isExist = await Category.countDocuments({ name: req.body.name });
        //     if(isExist)
        //     return res.status(400).json({
        //         success: false,
        //         statusCode: 400,
        //         message: "Category already exist"
        //     });
        //     let category = new Category({
        //         ...req.body
        //     });
        //     category = await category.save();
        //     return success(res, "Category created", category);
        // }catch(error){
        //     return failure(res, error.message, error);
        // }
    }
}

module.exports = new CategoryController();