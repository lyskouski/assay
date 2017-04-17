<?php
/**
 * Show SQL-patch to make schemas aligned
 * @sample php Sync_run.php >> sync_patch.sql
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
include './Sync.php';

echo (new Sync)
    ->definePattern(/* ... credentials pattern server */)
    ->defineTarget(/* ... credentials target server */)
    ->compare(Sync::VALUES)
    ->getSqlPatch();
