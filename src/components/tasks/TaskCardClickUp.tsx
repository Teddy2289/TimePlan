import React from "react";
import { MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";
import { type Task } from "../../types";

interface TaskCardClickUpProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskCardClickUp: React.FC<TaskCardClickUpProps> = ({
  task,
  onTaskClick,
}) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => onTaskClick(task)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-[13px] leading-tight">
          MRL Service
        </h3>
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Content Grid */}
      <div className="space-y-2">
        {/* Access Section */}
        <div>
          <div className="text-[11px] text-gray-500 font-medium mb-1">
            Access
          </div>
          <div className="text-[11px] text-gray-600 space-y-0.5">
            <div>ACDMA & UKECOMMA...</div>
            <div className="ml-1">Hotel Thailand: WZG-LSARN web-app</div>
            <div className="ml-3">• Graphika • Project Notes</div>
            <div>Offer un espace</div>
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* Name Space */}
        <div>
          <div className="text-[11px] text-gray-500 font-medium mb-1">
            Name Space / Graphics / 2: Graphics ...
          </div>
          <div className="text-[11px] text-gray-600">
            <div className="flex mb-1">
              <span className="text-gray-400 w-8">File</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-8">Groupes:</span>
              <span>Raw1 (See tables)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* Checklists Sections */}
        <div className="space-y-1.5">
          {/* OUTSET */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">OUTSET</div>
            <div className="flex items-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
              <span className="text-[11px] text-gray-600">ADVANT Tache</span>
            </div>
          </div>

          {/* VARIETY 1 */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">VARIETY</div>
            <div className="text-[11px] text-gray-600 mt-0.5">
              LOGO Hotel Thailand:
            </div>
            <div className="space-y-0.5 mt-1">
              {["man 5 + 400 pm", "Normals", ""].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 border border-gray-300 rounded mr-1.5 flex items-center justify-center">
                    {index === 1 && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VARIETY 2 */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">VARIETY</div>
            <div className="flex items-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
              <span className="text-[11px] text-gray-600">ADVANT Tache</span>
            </div>
          </div>

          {/* RESISTENT REPORT */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">
              RESISTENT REPORT
            </div>
            <div className="text-[11px] text-gray-600 mt-0.5">
              In most font confiance
            </div>
            <div className="space-y-0.5 mt-1">
              {["man 5, $15 am + 400 pm", "Upgrade"].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 border border-gray-300 rounded mr-1.5 flex items-center justify-center">
                    {index === 1 && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Token */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">Token</div>
            <div className="space-y-0.5 mt-1">
              {["New.11", "Normals"].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 border border-gray-300 rounded mr-1.5 flex items-center justify-center">
                    {index === 1 && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parashape */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">
              Parashape
            </div>
            <div className="space-y-0.5 mt-1">
              {["man 4", "Upgrade"].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 border border-gray-300 rounded mr-1.5 flex items-center justify-center">
                    {index === 1 && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Appular Tache */}
          <div>
            <div className="text-[11px] text-gray-500 font-medium">
              Appular Tache
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-[10px] text-gray-400">
          <div className="flex items-center space-x-1">
            <Paperclip size={10} />
            <span>0</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare size={10} />
            <span>0</span>
          </div>
        </div>
        <div className="w-5 h-5 bg-gray-400 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
          J
        </div>
      </div>
    </div>
  );
};

export default TaskCardClickUp;
