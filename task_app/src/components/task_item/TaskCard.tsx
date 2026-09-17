import React from 'react';
import { Pencil, Trash2, Calendar, LayoutList } from 'lucide-react';
import { Task } from '../types';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColors = {
    none: 'bg-gray-100 text-gray-600 border-gray-200',
    working: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const statusLabels = {
    none: 'None',
    working: 'Working',
    completed: 'Completed',
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const [year, month, day] = dateStr.split('-');
      return `${year}/${month}/${day}`;
    } catch {
      return dateStr;
    }
  };

  const formattedStart = formatDate(task.start_date);
  const formattedEnd = formatDate(task.end_date);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -1 }}
      className="bg-white border border-gray-200 rounded-xl mt-2 p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 w-full"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-gray-900 text-[17px] leading-tight truncate">
            {task.title}
          </h3>
          <div className="text-gray-500 text-sm mt-1">
            status: {task.status}
          </div>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-white bg-red-200 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {(task.content || task.start_date || task.end_date) && (
        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
          {task.content && (
            <p className="text-gray-600 text-sm whitespace-pre-wrap">
              {task.content}
            </p>
          )}
          {(task.start_date || task.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              <span>
                {formattedStart || '---'} <span className="text-gray-300 mx-0.5">→</span> {formattedEnd || '---'}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
