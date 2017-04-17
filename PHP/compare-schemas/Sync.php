<?php

/**
 * Prepare SQL-patch to synchronize Databases
 *
* @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
class Sync
{

    const TABLES = 1;
    const VALUES = 2;
    const DATA = 3;

    private $PATTERN_URL = '';
    private $PATTERN_USER = '';
    private $PATTERN_PSSW = '';
    private $PATTERN_DB = '';

    private $TARGET_URL = '';
    private $TARGET_USER = '';
    private $TARGET_PSSW = '';
    private $TARGET_DB = '';

    protected $oSqlPatch;
    protected $sFilePath = '';
    protected $oPattern;
    protected $oTarget;

    public function __construct()
    {
        ini_set('max_execution_time', '-1');
        ini_set('memory_limit', '1000M');
        $aPath = tempnam(sys_get_temp_dir(), get_class());
        if (file_exists($aPath)) {
            unlink($aPath);
        }
        $this->sFilePath = $aPath;
        $this->oSqlPatch = fopen($aPath, 'w+');
    }

    public function definePattern($url, $usr, $pssw, $schema)
    {
        $this->PATTERN_URL = $url;
        $this->PATTERN_USER = $usr;
        $this->PATTERN_PSSW = $pssw;
        $this->PATTERN_DB = $schema;
        return $this;
    }

    public function defineTarget($url, $usr, $pssw, $schema)
    {
        $this->TARGET_URL = $url;
        $this->TARGET_USER = $usr;
        $this->TARGET_PSSW = $pssw;
        $this->TARGET_DB = $schema;
        return $this;
    }

    public function __destruct()
    {
        fclose($this->oSqlPatch);
    }

    public function getConnection($sUrl, $sUser, $sPssw, $sDatabase)
    {
        $oDatabase = new mysqli($sUrl, $sUser, $sPssw);
        $oDatabase->select_db($sDatabase);
        $oDatabase->set_charset('utf8');
        return $oDatabase;
    }

    public function compare($iStep = self::VALUES, mysqli $oPattern = null, mysqli $oTarget = null)
    {
        $this->oPattern = $oPattern;
        $this->oTarget = $oTarget;
        if (is_null($oPattern)) {
            $this->oPattern = $this->getConnection($this->PATTERN_URL, $this->PATTERN_USER, $this->PATTERN_PSSW, $this->PATTERN_DB);
        }
        if (is_null($oTarget)) {
            $this->oTarget = $this->getConnection($this->TARGET_URL, $this->TARGET_USER, $this->TARGET_PSSW, $this->TARGET_DB);
        }

        $aExist = $this->compareTables($iStep);
        if (self::VALUES <= $iStep) {
            $aCorrect = $this->compareProperties($aExist);
            if (self::DATA <= $iStep) {
                $this->compareContent($aCorrect);
            }
        }

        return $this;
    }

    protected function compareTables($iStep)
    {
        $aPatternTables = $this->oPattern->query("SHOW TABLES")->fetch_all(MYSQLI_ASSOC);
        $aTargetTables = $this->oTarget->query("SHOW TABLES")->fetch_all(MYSQLI_ASSOC);

        foreach ($aTargetTables as &$tmp) {
            $tmp = current($tmp);
        }
        unset($tmp);


        $aTmpTables = array_flip(array_change_key_case(array_flip($aTargetTables), CASE_LOWER));
        $aExist = array();
        foreach ($aPatternTables as $a) {
            $sName = current($a);
            // Missing tables
            if (!in_array(strtolower($sName), $aTmpTables)) {
                $tmp = $this->oPattern->query("SHOW CREATE TABLE `$sName`")->fetch_array(MYSQLI_ASSOC);
                if (isset($tmp['Create Table'])) {
                    fwrite($this->oSqlPatch, "{$tmp['Create Table']};\n\n");
                } else {
                    fwrite($this->oSqlPatch, "-- ERROR: available keys " . implode(', ', array_keys($tmp)));
                }
                // Get content from a new table
                if (self::DATA <= $iStep) {
                    fwrite($this->oSqlPatch, $this->getContent($this->oPattern, $sName));
                }
            }
            // Database table's letter case inconsistency
            elseif (!in_array($sName, $aTargetTables)) {
                fwrite($this->oSqlPatch, "ALTER TABLE `{$aTargetTables[array_search(strtolower($sName), $aTmpTables)]}` RENAME TO `{$sName}--tmp` ;\n ALTER TABLE `{$sName}--tmp` RENAME TO  `$sName`; \n\n");
                //    $aExist[] = $sName;
            } else {
                $aExist[] = $sName;
            }
        }

        return $aExist;
    }

    protected function compareProperties($aExist)
    {
        foreach ($aExist as $sTable) {
            $aQuery = array();
            $aPatternTables = array();
            $aTargetTables = array();

            foreach (array('Pattern', 'Target') as $s) {
                $tmp = $this->{"o$s"}->query("SHOW CREATE TABLE `$sTable`")->fetch_array(MYSQLI_ASSOC);
                $sName = "a{$s}Tables";
                $aTarget = & $$sName;
                foreach (explode("\n", $tmp['Create Table']) as $sLine) {
                    $sLine = trim($sLine);
                    if ($sLine[strlen($sLine) - 1] == ',') {
                        $sLine = substr($sLine, 0, -1);
                    }
                    $aTarget[substr($sLine, 0, strpos($sLine, '` ') + 1)] = " $sLine";
                }
                unset($aTarget);
            }

            //foreach ($this->oPattern->query( "SHOW FIELDS FROM `$sTable`" )->fetch_array(MYSQLI_ASSOC) as $a) {
            //    $aPatternTables[ $a['Field'] ] = $a;
            //}
            //foreach ($this->oTarget->query( "SHOW FIELDS FROM `$sTable`" )->fetch_array(MYSQLI_ASSOC) as $a) {
            //    $aTargetTables[ $a['Field'] ] = $a;
            //}

            foreach ($aPatternTables as $sColumn => $sParams) {
                if (strpos($sParams, 'ENGINE=') || strpos($sParams, 'PRIMARY') || strlen($sColumn) <= 1) {
                    continue;
                }
                $sType = strpos($sParams, 'KEY ') ? '' : 'COLUMN';
                if (!isset($aTargetTables[$sColumn])) {
                    $aQuery[] = "ADD $sType " . str_replace(' KEY ', ' INDEX ', $sParams);
                } elseif (strcasecmp($sParams, $aTargetTables[$sColumn]) !== 0) {
                    $aQuery[] = "MODIFY $sType " . str_replace(' KEY ', ' INDEX ', $sParams);
                }
            }

            if ($aQuery) {
                fwrite($this->oSqlPatch, "ALTER TABLE `$sTable` " . implode(', ', $aQuery) . ";\n\n");
            }
        }
    }

    protected function compareContent($aCorrect)
    {
        if ($this->aCorrect) {
            $aCorrect = $this->aCorrect;
        }
        // @todo
    }

    /**
     * Get content from table
     *
     * @param string $sName
     * @param string $sCondition
     */
    protected function getContent(mysqli $oPattern, $sName, $sCondition = '1=1')
    {
        $sResult = '';

        $sBackupFile = tempnam(sys_get_temp_dir(), $sName);
        if (file_exists($sBackupFile)) {
            unlink($sBackupFile);
        }

        $sQueryBackup = "SELECT * INTO OUTFILE '$sBackupFile'  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\\n' FROM `$sName` WHERE $sCondition";
        $oPattern->query($sQueryBackup);
        // "LOAD DATA INFILE '$sBackupFile' INTO TABLE $sName";
        $aContent = explode("\n", file_get_contents($sBackupFile));
        if ($aContent) {
            $sResult = "INSERT INTO `$sName` VALUES (" . implode("), (", $aContent) . ");\n\n";
        }
        //unlink( $sBackupFile );
        return $sResult;
    }

    public function limitContent(array $aTables)
    {
        $this->aCorrect = $aTables;
        return $this;
    }

    public function getSqlPatch()
    {
        return stream_get_contents($this->oSqlPatch, -1, 0);
    }

    public function getFilePath()
    {
        return $this->sFilePath;
    }

    public function patchDatabase()
    {
        system("mysql -h {$this->TARGET_URL} -u{$this->TARGET_USER} -p{$this->TARGET_PSSW} {$this->TARGET_DB} < {$this->sFilePath}");
    }
}
