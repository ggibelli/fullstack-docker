import { render, fireEvent } from "@testing-library/react";
import React from "react";
import SingleTodo from "../../Todos/SingleTodo";

const todo = {
  text: "todo test",
  done: false,
};

describe("Single Todo component", () => {
  const completeTodo = jest.fn();
  const deleteTodo = jest.fn();
  it("The component renders as not done", () => {
    const { getByText } = render(
      <SingleTodo
        todo={todo}
        completeTodo={completeTodo}
        deleteTodo={deleteTodo}
      />
    );
    expect(getByText("todo test")).toBeInTheDocument();
    expect(getByText("This todo is not done")).toBeInTheDocument();
  });

  it("The component calls proper mocks", () => {
    const { getByText } = render(
      <SingleTodo
        todo={todo}
        completeTodo={completeTodo}
        deleteTodo={deleteTodo}
      />
    );
    const completeButton = getByText("Set as done");
    fireEvent.click(completeButton);
    expect(completeTodo).toBeCalledTimes(1);
  });
});
