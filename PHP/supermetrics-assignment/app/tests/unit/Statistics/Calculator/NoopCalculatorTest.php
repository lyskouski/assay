<?php

declare(strict_types = 1);

namespace Tests\unit\Statistics\Calculator;

use PHPUnit\Framework\TestCase;
use SocialPost\Dto\SocialPostTo;


/**
 * Class ATestTest
 *
 * @package Tests\unit
 */
class NoopCalculatorTest extends TestCase
{

    protected function generateSocialPost($userId, $date)
    {
        $post = new SocialPostTo();
        return $post->setId('post')
            ->setAuthorId($userId)
            ->setDate(new DateTime($date));
    }

    /**
     * @test
     */
    public function testNoopCalculatorResults(): void
    {
        $class = new ReflectionClass('Statistics\Calculator\NoopCalculator');
        $class->getMethod('doAccumulate')->setAccessible(true);
        $class->doAccumulate($this->generateSocialPost('1', '2023-01-01T06:38:54+00:00'));
        $class->doAccumulate($this->generateSocialPost('2', '2023-01-01T06:38:54+00:00'));
        $class->doAccumulate($this->generateSocialPost('1', '2023-01-01T06:38:54+00:00'));
        $class->doAccumulate($this->generateSocialPost('2', '2023-02-01T06:38:54+00:00'));
        $class->doAccumulate($this->generateSocialPost('1', '2023-02-01T06:38:54+00:00'));
        $class->getMethod('doCalculate')->setAccessible(true);
        /* $result Statistics\Dto\StatisticsTo */
        $result = $class->doCalculate()->getChildren();
        $this->assertEqual($result[0]->getValue(), 1.5);
        $this->assertEqual($result[1]->getValue(), 1);
    }
}
