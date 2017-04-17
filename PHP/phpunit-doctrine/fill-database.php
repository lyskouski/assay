<?php
/**
 * @note Inialize Entity Manager @see ./init-doctrine.php
 */
$em = \Doctrine\ORM\EntityManager::create(/* $connection, $ormConfig */);

$filepath = '{path to XML-file}'; /** @see ./fill-database.xml */

/**
 * Fill tables by using XML files
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
$connection = new \PHPUnit_Extensions_Database_DB_DefaultDatabaseConnection($em->getConnection());
$filler = new \PHPUnit_Extensions_Database_DefaultTester($connection);
if (file_exists($filepath)) {
    $filler->setDataSet(new \PHPUnit_Extensions_Database_DataSet_MysqlXmlDataSet($filepath));
}
$filler->onSetUp();
