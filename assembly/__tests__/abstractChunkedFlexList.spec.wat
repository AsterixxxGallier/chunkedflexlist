(module
 (type $none_=>_none (func))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32) (result i32)))
 (import "env" "memory" (memory $0 1))
 (data (i32.const 1036) "L\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00.\00\00\00A\00b\00s\00t\00r\00a\00c\00t\00C\00h\00u\00n\00k\00e\00d\00F\00l\00e\00x\00L\00i\00s\00t\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data (i32.const 1116) "\\\00\00\00\00\00\00\00\00\00\00\00\01\00\00\00B\00\00\00A\00b\00s\00t\00r\00a\00c\00t\00C\00h\00u\00n\00k\00e\00d\00F\00l\00e\00x\00L\00i\00s\00t\00.\00m\00a\00k\00e\00S\00p\00a\00c\00e\00\00\00\00\00\00\00\00\00\00\00")
 (data (i32.const 1212) "\1c\00\00\00\00\00\00\00\00\00\00\00\03\00\00\00\08\00\00\00\01\00\00\00\00\00\00\00\00\00\00\00")
 (data (i32.const 1244) "\1c\00\00\00\00\00\00\00\00\00\00\00\03\00\00\00\08\00\00\00\02\00\00\00\00\00\00\00\00\00\00\00")
 (data (i32.const 1276) "\1c\00\00\00\00\00\00\00\00\00\00\00\03\00\00\00\08\00\00\00\03\00\00\00\00\00\00\00\00\00\00\00")
 (import "__aspect" "reportTestTypeNode" (func $node_modules/@as-pect/assembly/assembly/internal/Test/test (param i32 i32)))
 (import "__aspect" "reportGroupTypeNode" (func $node_modules/@as-pect/assembly/assembly/internal/Test/describe (param i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (import "rtrace" "onstore" (func $~onstore (param i32 i32 i32 i32) (result i32)))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 17692))
 (global $~started (mut i32) (i32.const 0))
 (table $0 4 funcref)
 (elem $0 (i32.const 1) $start:assembly/__tests__/abstractChunkedFlexList.spec~anonymous|0~anonymous|0 $start:assembly/__tests__/abstractChunkedFlexList.spec~anonymous|0 $start:assembly/__tests__/abstractChunkedFlexList.spec~anonymous|0~anonymous|0)
 (export "__ignoreLogs" (func $node_modules/@as-pect/assembly/assembly/internal/log/__ignoreLogs))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "_start" (func $~start))
 (export "__call" (func $export:node_modules/@as-pect/assembly/assembly/internal/call/__call))
 (func $start:assembly/__tests__/abstractChunkedFlexList.spec~anonymous|0~anonymous|0
  nop
 )
 (func $node_modules/@as-pect/assembly/assembly/internal/log/__ignoreLogs (param $0 i32)
  nop
 )
 (func $~start
  global.get $~started
  if
   return
  end
  i32.const 1
  global.set $~started
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1308
  i32.lt_s
  if
   i32.const 17712
   i32.const 17760
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 8
  i32.const 0
  call $~onstore
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 4
  i32.const 0
  call $~onstore
  i32.const 1056
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.const 4
  i32.const 0
  call $~onstore
  i32.const 1264
  i32.store offset=4
  i32.const 1056
  i32.const 1264
  call $node_modules/@as-pect/assembly/assembly/internal/Test/describe
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $start:assembly/__tests__/abstractChunkedFlexList.spec~anonymous|0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1308
  i32.lt_s
  if
   i32.const 17712
   i32.const 17760
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 8
  i32.const 0
  call $~onstore
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 4
  i32.const 0
  call $~onstore
  i32.const 1136
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.const 4
  i32.const 0
  call $~onstore
  i32.const 1232
  i32.store offset=4
  i32.const 1136
  i32.const 1232
  call $node_modules/@as-pect/assembly/assembly/internal/Test/test
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $export:node_modules/@as-pect/assembly/assembly/internal/call/__call (param $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1308
  i32.lt_s
  if
   i32.const 17712
   i32.const 17760
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 4
  i32.const 0
  call $~onstore
  local.get $0
  i32.store
  local.get $0
  i32.load
  call_indirect $0 (type $none_=>_none)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
)
