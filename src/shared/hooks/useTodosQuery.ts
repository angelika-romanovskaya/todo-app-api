import { todosApi, ITodoResponse } from "@shared/api/todosApi";
import { ITodo } from "@entities/Todo/model/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";

const mapTodo = (t: ITodoResponse): ITodo => ({
	id: t.id,
	title: t.title,
	description: t.description,
	completed: t.completed,
});

export const useTodosQuery = () => {
	const queryClient = useQueryClient();

	const todosQuery = useQuery({
		queryKey: queryKeys.todos,
		queryFn: async () => {
			const data = await todosApi.getAll();
			return data.map(mapTodo);
		},
	});

	const addTodoMutation = useMutation({
		mutationFn: (text: string) => todosApi.create(text),
		onSuccess: (newTodo) => {
			queryClient.setQueryData<ITodo[]>(queryKeys.todos, (old) => {
				if (!old) return [mapTodo(newTodo)];
				return [mapTodo(newTodo), ...old];
			});
		},
	});

	const toggleTodoMutation = useMutation({
		mutationFn: (id: number) => todosApi.toggleCompleted(id),
		onSuccess: (updatedTodo) => {
			queryClient.setQueryData<ITodo[]>(queryKeys.todos, (old) =>
				old?.map((t) => (t.id === updatedTodo.id ? mapTodo(updatedTodo) : t)),
			);
		},
	});

	const editTodoMutation = useMutation({
		mutationFn: ({ id, text }: { id: number; text: string }) =>
			todosApi.update(id, text),
		onSuccess: (updatedTodo) => {
			queryClient.setQueryData<ITodo[]>(queryKeys.todos, (old) =>
				old?.map((t) => (t.id === updatedTodo.id ? mapTodo(updatedTodo) : t)),
			);
		},
	});

	const deleteTodoMutation = useMutation({
		mutationFn: (id: number) => todosApi.delete(id),
		onSuccess: (_, deletedId) => {
			queryClient.setQueryData<ITodo[]>(queryKeys.todos, (old) =>
				old?.filter((t) => t.id !== deletedId),
			);
		},
	});

	const clearCompletedMutation = useMutation({
		mutationFn: async () => {
			const completedTodos = todosQuery.data?.filter((t) => t.completed) ?? [];
			await Promise.all(completedTodos.map((t) => todosApi.delete(t.id)));
		},
		onSuccess: () => {
			queryClient.setQueryData<ITodo[]>(queryKeys.todos, (old) =>
				old?.filter((t) => !t.completed),
			);
		},
	});

	return {
		todos: todosQuery.data ?? [],
		isLoading: todosQuery.isLoading,
		error: todosQuery.error,
		isFetching: todosQuery.isFetching,
		addTodo: addTodoMutation.mutateAsync,
		toggleTodo: toggleTodoMutation.mutateAsync,
		editTodo: editTodoMutation.mutateAsync,
		deleteTodo: deleteTodoMutation.mutateAsync,
		clearCompleted: clearCompletedMutation.mutateAsync,
		isAddLoading: addTodoMutation.isPending,
		isToggleLoading: toggleTodoMutation.isPending,
		isEditLoading: editTodoMutation.isPending,
		isDeleteLoading: deleteTodoMutation.isPending,
		isClearingCompleted: clearCompletedMutation.isPending,
	};
};
