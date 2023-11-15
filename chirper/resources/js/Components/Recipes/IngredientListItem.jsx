// IngredientListItem.js

import React from 'react';

const formatName = name => name.charAt(0).toUpperCase() + name.slice(1);
const formatUnit = unit => unit.toLowerCase();

const IngredientListItem = ({ ingredient }) => {
    return (
        <li>
            {`${formatName(ingredient.originalName)} ${ingredient.measures.metric.amount} ${formatUnit(ingredient.measures.metric.unitLong || 'szt')}`}
        </li>

    );
};

export default IngredientListItem;
