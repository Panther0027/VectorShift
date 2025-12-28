import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import LLMNode from './nodes/LLMNode';
import TextNode from './nodes/TextNode';
import TransformNode from './nodes/TransformNode';
import FilterNode from './nodes/FilterNode';
import MergeNode from './nodes/MergeNode';
import ConditionNode from './nodes/ConditionNode';
import DataProcessingNode from './nodes/DataProcessingNode';

export const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  condition: ConditionNode,
  dataProcessing: DataProcessingNode,
};

