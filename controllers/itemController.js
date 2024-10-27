// controllers/itemController.js

/*
    This is Code responsible for managing items.
 */
const db = reqiure('../database');

// first - Create new item
exports.createitem = async (req,res) => {
    try{
        const{user_id, name , description , quantity , category , price_per_day , available} = req.body;

        const [item]= await db.query(
            `INSERT INTO items (user_id, name, description, quantity, category, price_per_day, available, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [user_id, name, description, quantity, category, price_per_day, available]
    );
        logger.info(`Item ${name} create successfully`);
         res.status(201).json({ message: 'Item created successfully.' });
    }catch (err) {
            logger.error(`Faild to create item :${err.message}`);
            res.status(500).json({ error: 'Failed to create item.' });
        }
    };
