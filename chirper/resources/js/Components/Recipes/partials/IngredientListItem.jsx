// // IngredientListItem.js
//
// import React from 'react';
//
// const formatName = name => name.charAt(0).toUpperCase() + name.slice(1);
// const formatUnit = unit => unit.toLowerCase();
//
// const IngredientListItem = ({ ingredient }, {source}) => {
//
//        if(source === 'spoon'){
//            return (
//
//                <li>
//                    {`${formatName(ingredient.originalName)} ${ingredient.measures.metric.amount} ${formatUnit(ingredient.measures.metric.unitLong || 'szt')}`}
//                </li>
//
//            );
//        }
//        };
//        else {
//     return (
//
//         <li>
//             {`${formatName(ingredient.name)} ${ingredient.quantity} ${formatUnit(ingredient.unit|| 'szt')}`}
//         </li>
//
//     );
// }
// }
//
//
//
//
// export default IngredientListItem;
import React from 'react';

const formatName = name => name.charAt(0).toUpperCase() + name.slice(1);
const formatUnit = unit => unit.toLowerCase();

const IngredientListItem = ({ ingredient, source }) => {
    const name = source === 'spoon' ? ingredient.originalName : ingredient.name;
    const quantity = source === 'spoon' ? ingredient.measures.metric.amount : ingredient.quantity;
    const unit = source === 'spoon' ? ingredient.measures.metric.unitLong : ingredient.unit;

    return (
        <li>
            {`${formatName(name)} ${quantity} ${formatUnit(unit || 'szt')}`}
        </li>
    );
};

export default IngredientListItem;
