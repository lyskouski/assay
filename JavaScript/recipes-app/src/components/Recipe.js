import React from "react";
import IngredientList from "./IngredientList";
import Instruction from "./Instruction";

export default function Recipe({ name, ingredients, steps }) {
    return (
        <section>
            <h1>{name}</h1>
            <IngredientList list={ingredients} />
            <Instruction title="Cooking Instructions" steps={steps} />
        </section>
    );
}