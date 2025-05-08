const categoryModel= require("../models/categoriesModel");


class category {
    addcategory= async (req,res) => {
        try {
        const {categoryname,description}= req.body;

        const addCategoryData= categoryModel({ categoryname,description});
         await addCategoryData.save();

         if(addCategoryData){
            res.status(200).json({
                success: true,
                message: "category created successfully",
                data: addCategoryData,
            })
         }
        } catch (error) {

            res.status(200).json({
                success: false,
                message: "unable create category",
            
            })
            
        }

        
    }

    getAllCategoryWithPostDetails = async (req, res) => {
        try {
          const categoryWithDetails = await categoryModel.aggregate([
            {
              $lookup: {
                from: "posts", 
                localField: "_id",
                foreignField: "categoryId",
                as: "posts", 
              },
            },
          ]);
      
          res.status(200).json({
            success: true,
            message: "Categories with posts fetched successfully",
            data: categoryWithDetails,
          });
        } catch (error) {
          console.error("Error fetching categories with posts:", error);
          res.status(500).json({
            success: false,
            message: "Failed to fetch category post details",
            error: error.message,
          });
        }
      };
      


}

module.exports= new category()