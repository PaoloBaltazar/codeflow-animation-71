import { supabase } from "@/lib/supabase";
import { addDays, parseISO, isPast } from "date-fns";
import { Task } from "@/types/task";

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: "deadline" | "overdue" | "status" | "completed",
  taskId: string
) => {
  // Get the actual user ID from the auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No authenticated session found");
  }

  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: session.user.id, // Use the actual UUID from the session
        title,
        message,
        type,
        task_id: taskId,
      },
    ]);

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const checkTaskDeadlines = async (task: Task) => {
  const deadlineDate = parseISO(task.deadline);
  const twoDaysFromNow = addDays(new Date(), 2);
  
  // Get the actual user ID from the auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No authenticated session found");
  }

  // Check if task is due within 2 days and not completed
  if (deadlineDate <= twoDaysFromNow && task.status !== "completed") {
    // Notify using the actual user ID
    await createNotification(
      session.user.id,
      "Task Due Soon",
      `The task "${task.title}" is due on ${task.deadline}`,
      "deadline",
      task.id
    );
  }

  // Check if task is overdue
  if (isPast(deadlineDate) && task.status !== "completed") {
    // Notify using the actual user ID
    await createNotification(
      session.user.id,
      "Task Overdue",
      `The task "${task.title}" is overdue`,
      "overdue",
      task.id
    );
  }
};

export const handleTaskStatusChange = async (task: Task) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No authenticated session found");
  }

  // Notify using the actual user ID
  await createNotification(
    session.user.id,
    "Task Status Updated",
    `Task "${task.title}" status has been updated to ${task.status}`,
    "status",
    task.id
  );

  // If task is completed, send another notification
  if (task.status === "completed") {
    await createNotification(
      session.user.id,
      "Task Completed",
      `Task "${task.title}" has been marked as completed`,
      "completed",
      task.id
    );
  }
};